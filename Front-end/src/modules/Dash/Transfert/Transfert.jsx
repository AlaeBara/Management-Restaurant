import React, { useState,useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { useNavigate} from 'react-router-dom';
import {useFetchProduct} from './hooks/useFetchProduct'
import {useFetchInventorysProduct} from './hooks/useFetchInventorysOfProuct'


const InventoriesMovements = z.object({
    idProduit :z
        .string()
        .nonempty({ message: "Produit est obligatoire." }),

    inventoryId: z
        .string()
        .nonempty({ message: "l'inventaire est obligatoire." }),

    transfertToInventoryId: z
        .string()
        .nonempty({ message: "l'inventaire destination est obligatoire." }),

    quantity: z.coerce.number({
            required_error: "La quantité  est obligatoire.",
            invalid_type_error: "La quantité  est obligatoire.",
        })
        .nonnegative({ message: "La quantité doit être un nombre positif." }),

    movementDate: z
        .string()
        .nullable()
        .optional(),

    notes: z
        .string()
        .max(255, { message: "Les notes doivent contenir au maximum 255 caractères." })
        .nullable()
        .optional(),

    reason: z
        .string()
        .max(255, { message: "La raison doit contenir au maximum 255 caractères." })
        .nullable()
        .optional(),
});


export default function Component() {
    const {products, totalProduct, loading, error, fetchProduct } = useFetchProduct()
    const { inventorys, iSloading, message, fetchIventory } =useFetchInventorysProduct()

    const [formData, setFormData] = useState({
        idProduit: '',
        inventoryId: '',
        quantity: null,
        movementType:'transfert',
        transfertToInventoryId: '',
        movementDate: null,
        notes:null,
        reason:null,
    });

    useEffect(() => {
        fetchProduct({fetchAll: true});
    }, []);

    useEffect(() => {
        if (formData.idProduit) {
            fetchIventory(formData.idProduit);
        }
    }, [formData.idProduit]);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const Submit = async (e) => {
        e.preventDefault();
        try {
            
            formData.quantity = parseFloat(formData.quantity);
            const preparedData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null && value !== '' && key !== 'idProduit' )
            );
            InventoriesMovements.parse(formData);
          
            const token = Cookies.get('access_token');

            console.log(preparedData)

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/inventories-movements/transfer`, preparedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                idProduit:null,
                inventoryId: null,
                quantity: null,
                movementType:'',
                transfertToInventoryId: null,
                movementDate: null,
                notes:null,
                reason:null,
            });
            setErrors({});
            toast.success('Mouvement Inventaire créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
            });
        } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            const errorMessage = error.response?.data?.message || error.message;
            console.error('Error creating Inventories Movements:', errorMessage);
            toast.error(errorMessage, {
            icon: '❌',
            position: "top-right",
            autoClose: 3000,
            });
        }
        }
    };

  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Transfert</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour effectuer un transfert entre inventaires.
            </p>
        </div>

        <div className="container p-0 max-w-2xl">
            <Card className="w-full border-none shadow-none">

                <CardContent className="pt-6">
                    <form onSubmit={Submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="idProduit">Produit <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                id="idProduit"
                                name="idProduit"
                                value={formData.idProduit  || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'idProduit', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le produit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.length > 0 ? (
                                        products
                                            .map((product) => (
                                                <SelectItem key={product.id} value={product.id}>
                                                    {product.productSKU} - {product.productName}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.idProduit && (
                                <p className="text-xs text-red-500 mt-1">{errors.idProduit}</p>
                            )}
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="inventoryId">l'inventaire du mouvement <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                id="inventoryId"
                                name="inventoryId"
                                value={formData.inventoryId  || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'inventoryId', value } })}
                                disabled={!formData.idProduit}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez l'inventaire du mouvement " />
                                </SelectTrigger>
                                <SelectContent>
                                    {inventorys.length > 0 ? (
                                        inventorys
                                        .filter(inventory => inventory.id !== formData.transfertToInventoryId)
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
                            {errors.inventoryId && (
                                <p className="text-xs text-red-500 mt-1">{errors.inventoryId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transfertToInventoryId">l'inventaire de destination <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                id="transfertToInventoryId"
                                name="transfertToInventoryId"
                                value={formData.transfertToInventoryId  || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'transfertToInventoryId', value } })}
                                disabled={!formData.idProduit}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez l'inventaire de destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    {inventorys.length > 0 ? (
                                        inventorys
                                        .filter(inventory => inventory.id !== formData.inventoryId)
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
                            {errors.transfertToInventoryId && (
                                <p className="text-xs text-red-500 mt-1">{errors.transfertToInventoryId}</p>
                            )}
                        </div>
                    
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantité {products.find(product => product.id === formData.idProduit)?.unit ? `(${products.find(product => product.id === formData.idProduit)?.unit})` : ''} <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                type='Number'
                                id="quantity"
                                name="quantity"
                                value={formData.quantity || ''}
                                onChange={handleChange}
                                placeholder="Entrez la quantité"
                                min='0'
                                step="any"
                            />
                            {errors.quantity && (
                            <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="movementDate">Date de movement</Label>
                            <input
                                type="datetime-local"
                                id="movementDate"
                                name="movementDate"
                                value={formData.movementDate || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <p className="text-xs text-gray-600 mt-0">
                                Sélectionnez la date et l'heure du mouvement d'inventaire.
                            </p>
                            {errors.storageId && (
                                <p className="text-xs text-red-500 mt-1">{errors.storageId}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes || ""}
                                onChange={handleChange}
                                placeholder="Ajoutez des notes ici"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="2"
                            />
                            {errors.notes && (
                            <p className="text-xs text-red-500 mt-1">{errors.notes}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Raison</Label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason || ""}
                                onChange={handleChange}
                                placeholder="Ajoutez une raison ici"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="2"
                            />
                            {errors.reason && (
                            <p className="text-xs text-red-500 mt-1">{errors.reason}</p>
                            )}
                        </div>
                        
                        <div className="flex gap-4">
                            <Button type="submit" className="w-full">
                                Ajouter
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </>
  );
}
