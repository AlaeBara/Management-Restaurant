import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {useFetchSupliers} from '../Hooks/useFetchALLSupliers'
import {useFetchProduct} from '../Hooks/useFetchALLProducts'
import {useFetchFunds} from '../Hooks/useFetchALLCaisses'
import {useFetchIventory} from '../Hooks/useFetchInventorys'


const ProductItemSchema = z.object({
    productID: z.string({ 
        required_error: "Le produit est obligatoire" 
    }).min(1, { message: "Veuillez sélectionner un produit" }),
    
    inventoryId: z.string({ 
        required_error: "L'inventaire est obligatoire" 
    }).min(1, { message: "Veuillez sélectionner un inventaire" }),
    
    quantity: z.coerce.number({
        required_error: "La quantité est obligatoire",
        invalid_type_error: "La quantité est obligatoire",
    })
    .positive({ message: "La quantité doit être un nombre positif" }),
    
    unitPrice: z.coerce.number({
        required_error: "Le prix unitaire est obligatoire",
        invalid_type_error: "Le prix unitaire est obligatoire",
    })
    .positive({ message: "Le prix unitaire doit être un nombre positif" }),
    
    totalAmount: z.coerce.number({
        required_error: "Le montant total est obligatoire",
        invalid_type_error: "Le montant total est obligatoire",
    })
    .positive({ message: "Le montant total doit être un nombre positif ou zéro" }),
});

const AchatFormSchema = z.object({
    supplierId: z.string({ 
        required_error: "Le fournisseur est obligatoire" 
    }).min(1, { message: "Veuillez sélectionner un fournisseur" }),
    
    sourcePaymentId: z.string({ 
        required_error: "La source de paiement est obligatoire" 
    }).min(1, { message: "Veuillez sélectionner une source de paiement" }),
    
    purchaseDate: z.string({ 
        required_error: "La date d'achat est obligatoire" 
    }).refine(val => {
        const date = new Date(val);
        return !isNaN(date.getTime());
    }, { message: "Veuillez saisir une date valide" }),
    
    ownerReferenece: z.string().nullable().optional(),
    
    supplierReference: z.string({ 
        required_error: "La référence fournisseur est obligatoire" 
    }).min(1, { message: "La référence fournisseur ne peut pas être vide" }),
    
    taxPercentage: z.coerce
    .number({
        required_error: "Le pourcentage de taxe est obligatoire",
        invalid_type_error: "Le pourcentage de taxe est obligatoire",
    })
    .min(0, { message: "Le pourcentage de taxe doit être au moins 0" })
    .max(100, { message: "Le pourcentage de taxe doit être au plus 100" }),

   
    items: z.array(ProductItemSchema).min(1, { 
        message: "Au moins un produit est requis" 
    }),
    
    note: z.string().optional()
});



export default function AchatCreationForm() {
    const navigate = useNavigate();

    const [alert, setAlert] = useState({ message: null, type: null });

    //api for get All Fournisseur
    const {Supliers , fetchSupliers} = useFetchSupliers()


    //api for get all Caisses
    const {funds  , fetchFunds} = useFetchFunds()


    //api for get All Produit 
    const {products , fetchProduct} = useFetchProduct()


    //api for get All inventaire of product
    const {inventorys, totalIventory, loading, error, fetchIventory}=useFetchIventory()


    useEffect(()=>{
        fetchSupliers({fetchAll:true})
        fetchFunds({fetchAll:true})
        fetchProduct({fetchAll:true})
        fetchIventory({fetchAll:true})
    },[fetchSupliers,fetchFunds,fetchProduct])

    const [formData, setFormData] = useState({
        supplierId: '',
        sourcePaymentId: '',
        purchaseDate: '',
        ownerReferenece: '',
        supplierReference: '',
        totalAmountHT: 0,
        taxPercentage: "20",
        totalAmountTTC: 0,
        items: [
            {
                productID: '',
                inventoryId: '',
                quantity: null,
                unitPrice: null,
                totalAmount: null
            }
        ]
    });
    

    const [totals, setTotals] = useState({
        totalHT: 0,
        remiseTotal: 0,
        baseHT: 0,
        tvaRate: parseFloat(formData.taxPercentage) /100,
        tva: 0,
        totalTTC: 0
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleChangee = (value, index, field) => {
        const updatedItems = [...formData.items];
        
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };
    
        if (field === 'productID') {
            // Reset inventory when product changes
            updatedItems[index].inventoryId = '';
        }
        
        if (field === 'quantity' || field === 'unitPrice') {
            // Parse the value of quantity and unitPrice as float (number)
            const parsedQuantity = field === 'quantity' ? parseFloat(value) : updatedItems[index].quantity;
            const parsedUnitPrice = field === 'unitPrice' ? parseFloat(value) : updatedItems[index].unitPrice;
    
            // Update the quantity and unitPrice with the parsed numbers if valid
            if (!isNaN(parsedQuantity)) {
                updatedItems[index].quantity = parsedQuantity;
            }
    
            if (!isNaN(parsedUnitPrice)) {
                updatedItems[index].unitPrice = parsedUnitPrice;
            }
            
            // Calculate total amount if both quantity and unit price are valid numbers
            if (!isNaN(updatedItems[index].quantity) && !isNaN(updatedItems[index].unitPrice)) {
                updatedItems[index].totalAmount = updatedItems[index].quantity * updatedItems[index].unitPrice;
            }
        }
    
        // Update the form data with the new items array
        setFormData(prevFormData => ({
            ...prevFormData,
            items: updatedItems
        }));
    };
    

    // Add product row
    const addProduct = () => {
        setFormData({
            ...formData,
            items: [...formData.items, {
                productID: '',
                inventoryId: '',
                quantity: null,
                unitPrice: null,
                totalAmount: null
            }]
        });
    };

    // Remove product row
    const removeProduct = (index) => {
        const newitems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newitems });
    };

    // Calculate totals
    // useEffect(() => {
    //     const calculatedTotals = formData.items.reduce((acc, item) => {
    //         const quantity = parseFloat(item.quantity) || 0;
    //         const unitPrice = parseFloat(item.unitPrice) || 0;

    //         const lineTotal = quantity * unitPrice;
    //         return {
    //             totalHT: acc.totalHT + lineTotal,
    //             baseHT: acc.baseHT + lineTotal
    //         };
    //     }, { totalHT: 0, baseHT: 0 });

    //     const tva = calculatedTotals.baseHT * totals.tvaRate;
    //     const totalTTC = calculatedTotals.baseHT + tva;

    //     setTotals({
    //         ...calculatedTotals,
    //         tva,
    //         totalTTC,
    //         tvaRate: totals.tvaRate
    //     });
    // }, [formData.items, formData.taxPercentage]);

    useEffect(() => {
        // Convert tax percentage to decimal
        const tvaRate = parseFloat(formData.taxPercentage) / 100;
        const calculatedTotals = formData.items.reduce((acc, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unitPrice) || 0;

            const lineTotal = quantity * unitPrice;
            return {
                totalHT: acc.totalHT + lineTotal,
                baseHT: acc.baseHT + lineTotal
            };
        }, { totalHT: 0, baseHT: 0 });

        const tva = calculatedTotals.baseHT * tvaRate;
        const totalTTC = calculatedTotals.baseHT + tva;

        setTotals({
            ...calculatedTotals,
            tva,
            totalTTC,
            tvaRate
        });

        // Update formData with calculated totals
        setFormData(prevFormData => ({
            ...prevFormData,
            totalAmountHT: calculatedTotals.baseHT,
            totalAmountTTC: totalTTC
        }));
    }, [formData.items, formData.taxPercentage]);


    // Submit handler
    const [errors, setErrors] = useState({});

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            formData.taxPercentage=parseFloat(formData.taxPercentage)
            AchatFormSchema.parse(formData);

            console.log(formData)
            const token = Cookies.get('access_token');
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/purchases`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                supplierId: '',
                sourcePaymentId: '',
                purchaseDate: '',
                ownerReferenece: '',
                supplierReference: '',
                totalAmountHT: null,
                taxPercentage: 20,
                totalAmountTTC: null,
                items: [
                    {
                        productID: '',
                        inventoryId: '',
                        quantity: null,
                        unitPrice: null,
                        totalAmount: null
                    }
                ]
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message || 'Achats créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/achats`),
            });
        } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce((acc, { path, message }) => {
                // Handle nested items errors
                if (path[0] === 'items') {
                    const itemIndex = path[1];
                    const fieldName = path[2];
                    // Initialize nested structures if they don't exist
                    if (!acc.items) acc.items = [];
                    if (!acc.items[itemIndex]) acc.items[itemIndex] = {};
                    
                    acc.items[itemIndex][fieldName] = message;
                } else {
                    // Handle top-level form errors
                    acc[path[0]] = message;
                }
                return acc;
            }, {});
            
            setErrors(fieldErrors);
        } else {
            console.error('Error creating purchase:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message[0] 
                : error.response?.data?.message || 'Erreur lors de la creation d\'achats',
                type: "error",
            });
        }
        }
    };


    return (
        <div className="w-full">

            <ToastContainer />
            <div className="space-y-2 p-4">
                <h1 className="text-2xl font-bold text-black font-sans">Ajouter un Nouvel Achat</h1>
                <p className="text-base text-gray-600">
                    Remplissez les informations ci-dessous pour ajouter un nouvel achat au système.
                </p>
            </div>

            <div className="w-full p-4">

                {alert?.message && (
                    <Alert
                        variant={alert.type === "error" ? "destructive" : "success"}
                        className={`mt-4 mb-4 text-center ${
                            alert.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                    >
                        <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <Label>Fournisseur <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                name="supplierId"
                                value={formData.supplierId}
                                onValueChange={(value) => handleChange({ target: { name: 'supplierId', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un Fournisseur" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Supliers.length > 0 ? (
                                            Supliers
                                                .map((Suplier) => (
                                                    <SelectItem key={Suplier.id} value={Suplier.id}>
                                                        {Suplier.name}
                                                    </SelectItem>
                                                ))
                                        ) : (
                                            <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.supplierId && (
                                <p className="text-xs text-red-500 mt-1">{errors.supplierId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Source de paiement <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                name="sourcePaymentId"
                                value={formData.sourcePaymentId}
                                onValueChange={(value) => handleChange({ target: { name: 'sourcePaymentId', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un Source de paiement" />
                                </SelectTrigger>
                                <SelectContent>
                                    {funds.length > 0 ? (
                                            funds
                                                .map((fund) => (
                                                    <SelectItem key={fund.id} value={fund.id}>
                                                        {fund.name}
                                                    </SelectItem>
                                                ))
                                        ) : (
                                            <p className='text-sm'>Aucune donnée disponible</p>
                                    )}  
                                </SelectContent>
                            </Select>
                            {errors.sourcePaymentId && (
                                <p className="text-xs text-red-500 mt-1">{errors.sourcePaymentId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Date d'achat <span className='text-red-500 text-base'>*</span></Label>
                            {/* <Input
                                type="date"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                            /> */}
                            <input
                                type="datetime-local"
                                id="movementDate"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                                className="w-full p-1  border border-gray-200 rounded-md"
                            />
                            {errors.purchaseDate && (
                                <p className="text-xs text-red-500 mt-1">{errors.purchaseDate}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Référence propriétaire</Label>
                            <Input
                                name="ownerReferenece"
                                value={formData.ownerReferenece}
                                onChange={handleChange}
                                placeholder='Référence propriétaire'
                            />
                            {errors.ownerReferenece && (
                                <p className="text-xs text-red-500 mt-1">{errors.ownerReferenece}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Référence fournisseur <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                name="supplierReference"
                                value={formData.supplierReference}
                                onChange={handleChange}
                                placeholder='Référence fournisseur'
                            />
                            {errors.supplierReference && (
                                <p className="text-xs text-red-500 mt-1">{errors.supplierReference}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Pourcentage de taxe</Label>
                            <Input
                                type="number"
                                name="taxPercentage"
                                value={formData.taxPercentage || ""}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value === "") {
                                        value = 0;
                                    } else if (value < 0) {
                                        value = 0;
                                    } else if (value > 100) {
                                        value = 100;
                                    }
                        
                                    handleChange({ target: { name: "taxPercentage", value } });
                                }}
                                placeholder='Pourcentage de taxe'
                                min="0"
                                max="100"
                                
                            />
                            {errors.taxPercentage && (
                                <p className="text-xs text-red-500 mt-1">{errors.taxPercentage}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Remise</Label>
                            <Input
                                type="number"
                                name="Remise"
                                value={0}
                                disabled={true}
                            />
                            {/* {errors.remise && (
                                <p className="text-xs text-red-500 mt-1">{errors.remise}</p>
                            )} */}
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Produits</h2>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={addProduct}
                                className="flex items-center gap-2"
                            >
                                <Plus size={16} /> Ajouter Produit
                            </Button>
                        </div>

                        {/* Product Grid */}
                        <div className="grid gap-4">
                            {formData.items.map((product, index) => (
                                <div 
                                    key={index} 
                                    className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 border p-4 rounded-lg"
                                >
                                    <div className="space-y-2">
                                        <Label>Produit <span className='text-red-500 text-base'>*</span></Label>
                                        <Select
                                            name="productID"
                                            value={product.productID}
                                            onValueChange={(value) => handleChangee(value, index, 'productID')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un Produit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.length > 0 ? (
                                                    products
                                                        .map((product) => (
                                                            <SelectItem key={product.id} value={product.id}>
                                                                {product.productName}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <p className='text-sm'>Aucune donnée disponible</p>
                                                )}  
                                            </SelectContent>
                                        </Select>
                                        {errors.items && errors.items[index] && errors.items[index].productID && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {errors.items[index].productID}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Inventaire <span className='text-red-500 text-base'>*</span></Label>
                                        <Select
                                            name="inventoryId"
                                            value={product.inventoryId}
                                            onValueChange={(value) => handleChangee(value, index, 'inventoryId')}
                                            disabled={!product.productID}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un inventaire" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {inventorys.length > 0 ? (
                                                    inventorys
                                                    .filter((inventory) => inventory.productId ===product.productID)
                                                        .map((inventory) => (
                                                            <SelectItem key={inventory.id} value={inventory.id}>
                                                                {inventory.sku} 
                                                            </SelectItem>
                                                        ))
                                                ) : (
                                                    <p className='text-sm'>Aucune donnée disponible</p>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.items && errors.items[index] && errors.items[index].inventoryId && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {errors.items[index].inventoryId}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Quantité <span className='text-red-500 text-base'>*</span></Label>
                                        <Input
                                            type="number"
                                            name="quantity"
                                            value={product.quantity  || ''}
                                            onChange={(e) => handleChangee(e.target.value, index, 'quantity')}
                                            placeholder="Quantité"
                                            min="0"
                                        />
                                        {errors.items && errors.items[index] && errors.items[index].quantity && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {errors.items[index].quantity}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Prix Unitaire HT <span className='text-red-500 text-base'>*</span></Label>
                                        <Input
                                            type="number"
                                            name="unitPrice"
                                            value={product.unitPrice || ''}
                                            onChange={(e) => handleChangee(e.target.value, index, 'unitPrice')}
                                            placeholder="Prix HT"
                                            step="any"
                                            min="0"
                                        />
                                        {errors.items && errors.items[index] && errors.items[index].unitPrice && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {errors.items[index].unitPrice}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Montant total <span className='text-red-500 text-base'>*</span></Label>
                                        <Input
                                            type="number"
                                            name="totalAmount"
                                            value={product.totalAmount  || ''}
                                            onChange={(e) => handleChangee(e.target.value, index, 'totalAmount')}
                                            placeholder="Montant total"
                                            step="any"
                                            min="0"
                                            disabled={true}
                                        />
                                        {errors.items && errors.items[index] && errors.items[index].totalAmount && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {errors.items[index].totalAmount}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-end justify-center h-full">
                                        {formData.items.length > 1 && (
                                            <Button 
                                                type="button" 
                                                variant="destructive" 
                                                size="icon"
                                                onClick={() => removeProduct(index)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals and note Section */}
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">

                        <div className="border p-6 rounded-lg bg-gray-50">
                            <h2 className="text-2xl font-semibold mb-4">Résumé</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Total HT</span>
                                    <strong>{totals.totalHT.toFixed(2)} €</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Remise Totale</span>
                                    {/* <strong>{totals.remiseTotal} €</strong> */}
                                </div>
                                <div className="flex justify-between">
                                    <span>Base HT</span>
                                    <strong>{totals.baseHT.toFixed(2)} €</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>TVA ({((formData.taxPercentage/100) * 100).toFixed(0)}%)</span>
                                    <strong>{totals.tva.toFixed(2)} €</strong>
                                </div>
                                <div className="flex justify-between text-xl font-bold border-t pt-2">
                                    <span>Total TTC</span>
                                    <strong>{totals.totalTTC.toFixed(2)} €</strong>
                                </div>
                            </div>
                        </div>

                        <div className="border p-6 rounded-lg bg-gray-50">
                            <Label>Notes</Label>
                            <Textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Entrez des notes supplémentaires sur l'achat"
                                className="min-h-[200px] mt-4 bg-white"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => navigate('/dash/achats')} 
                            className="w-full"
                        >
                            Annuler
                        </Button>
                        <Button type="submit" className="w-full">
                            Créer Achat
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}