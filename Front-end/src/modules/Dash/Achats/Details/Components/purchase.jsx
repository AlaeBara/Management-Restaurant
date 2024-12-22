import React, { useState ,useEffect} from 'react'
import {Dot ,ArrowLeftRight,ChevronRight ,Download  ,Loader,Plus} from 'lucide-react'
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import {formatDate}  from '@/components/dateUtils/dateUtils'
import {useMovements} from '../hooks/useMovements'
import {useFetchProduct} from '../../Hooks/useFetchALLProducts'
import {useFetchIventory} from '../../Hooks/useFetchInventorys'
import {useAddItem} from '../hooks/useAddItem'
import { useParams } from 'react-router-dom';

const purchase = ({purchase , fetchData}) => {

    const {id} =useParams()
    const [isModalVisible ,setIsModalVisible] =useState(false)

    function StatusToFrench(status) {
  
        const normalizedStatus = status ? status.toUpperCase().trim() : '';
      
        const statusTranslations = {
          'CREATED': { 
            label: 'Créé', 
            style: 'bg-gray-200 text-gray-800 rounded px-2 py-1 text-sm font-medium' 
          },
          'CONFIRMED': { 
            label: 'Confirmé', 
            style: 'bg-blue-200 text-blue-800 rounded px-2 py-1 text-sm font-medium' 
          },
          'DELIVERING': { 
            label: 'En livraison', 
            style: 'bg-yellow-200 text-yellow-800 rounded px-2 py-1 text-sm font-medium' 
          },
          'CANCELLED': { 
            label: 'Annulé', 
            style: 'bg-red-200 text-red-800 rounded px-2 py-1 text-sm font-medium' 
          },
          'COMPLETED': { 
            label: 'Terminé', 
            style: 'bg-green-200 text-green-800 rounded px-2 py-1 text-sm font-medium' 
          }
        };
      
        const statusInfo = statusTranslations[normalizedStatus] || { 
          label: status || 'Statut inconnu', 
          style: 'bg-gray-200 text-gray-800 rounded px-2 py-1 text-sm font-medium' 
        };
      
        return statusInfo;
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD'
        }).format(value);
    };
    
    const [formData, setFormData] = useState({
        quantityToMove: '',
        quantityToReturn: '',
    });

    const [produitselected, setProduitselected] = useState(null)

    const [idSelected, setIdSelected] = useState(null);

    const showModel =(id,name)=>{
        setIsModalVisible(true);
        setIdSelected(id)
        setProduitselected(name)
    }

    const CloseModel =()=>{
        setIsModalVisible(false);
        setFormData({
            quantityToMove: '',
            quantityToReturn: '',
        })  
        resetErrors()
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { issLoading , alert, errors, fetchMovements ,resetErrors} = useMovements(idSelected , formData ,CloseModel)

    //model of creation item
    const [isModalCreationVisible ,setIsModalCreationVisible] =useState(false)
    
    const [formData2, setFormData2] = useState({
        productId: '',
        inventoryId: '',
        quantity: null,
        unitPrice: null,
        totalAmount: null
    });

    const showModelCreation =()=>{
        setIsModalCreationVisible(true);
    }
    const CloseModelCreation =()=>{
        setIsModalCreationVisible(false);
        setFormData2({
            productId: '',
            inventoryId: '',
            quantity: null,
            unitPrice: null,
            totalAmount: null
        })
        resetErrorss()
    } 

    const handleChangee = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData2, [name]: value };
    
        if (name === 'quantity' || name === 'unitPrice') {
            const parsedQuantity = name === 'quantity' ? parseFloat(value) : parseFloat(updatedFormData.quantity);
            const parsedUnitPrice = name === 'unitPrice' ? parseFloat(value) : parseFloat(updatedFormData.unitPrice);
    
            if (!isNaN(parsedQuantity)) {
                updatedFormData.quantity = parsedQuantity;
            }
    
            if (!isNaN(parsedUnitPrice)) {
                updatedFormData.unitPrice = parsedUnitPrice;
            }
    
            // Calculate total amount if both quantity and unit price are valid numbers
            if (!isNaN(updatedFormData.quantity) && !isNaN(updatedFormData.unitPrice)) {
                updatedFormData.totalAmount = updatedFormData.quantity * updatedFormData.unitPrice;
            } else {
                updatedFormData.totalAmount = '';
            }
        }
        setFormData2(updatedFormData);
    };
    

    //api for get All Produit + All inventaire of product
    const {products , fetchProduct} = useFetchProduct()
    const {inventorys,  fetchIventory}=useFetchIventory()

    useEffect(()=>{
        fetchProduct({fetchAll:true})
        fetchIventory({fetchAll:true})
    },[isModalCreationVisible])


    const {isssLoading, alertt, errorss, fetchAddItem, resetErrorss} = useAddItem(id,formData2, CloseModelCreation,fetchData)


  return (
    <>
        <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit rounded-2xl'>
            <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-100 bg-gray-50 rounded-tl-2xl rounded-tr-2xl p-4 mb-5'>
                <CardTitle className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center'>
                    <ChevronRight className='mr-2 text-primary' />
                    Détails de l'achat 
                    <span className="ml-2 p-2 border border-black bg-black rounded  cursor-pointer">
                        <Download className="w-4 h-4" stroke="white" />
                    </span>
                </CardTitle>
               
                <Button
                    type="submit"
                    className="w-full sm:w-auto rounded-md bg-black px-4 py-2 text-sm font-medium text-white whitespace-nowrap"
                    onClick={showModelCreation}
                >
                    <Plus className='mr-2 h-4 w-4'/> Ajouter Item
                </Button>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">
                    <div className="flex text-base">
                        <Dot />
                        <span className='text-black text-base mr-2 font-medium text-nowrap'> Référence achat :</span>
                        {purchase?.ownerReferenece}
                    </div>
                    <div className="flex  text-base text-nowrap">
                        <Dot />
                        <span className='text-black text-base mr-2 font-medium'>Date d'achat :</span>
                        {formatDate(purchase?.purchaseDate)}
                    </div>
                    <div className="flex text-base">
                        <Dot />
                        <span className='text-black text-base mr-2 font-medium'>Status :</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${StatusToFrench(purchase?.status).style}`}>
                            {StatusToFrench(purchase?.status).label}
                        </span>
                    </div>
                    <div className="flex text-base">
                        <Dot />
                        <span className='text-black text-base mr-2 font-medium'>Tax :</span>
                        <span> {purchase?.taxPercentage} %</span>
                    </div>
                </div>
                <Table>
                    <TableHeader className="border border-gray-200">
                        <TableRow  className='hover:bg-transparent'>
                            <TableHead>Produit</TableHead>
                            <TableHead className="text-center border">Qté</TableHead>
                            <TableHead className="text-center border">Prix</TableHead>
                            <TableHead className="text-center border">Sous-total</TableHead>
                            <TableHead className="text-center border">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchase?.purchaseItems.map((item) => (
                            <TableRow key={item.id} className="font-sans font-medium border border-gray-200">
                                <TableCell>{item.product.productName}</TableCell>
                                <TableCell className="text-center  p-4 border">{item.quantity}</TableCell>
                                <TableCell className="text-center  p-4 border">{formatCurrency(item.unitPrice)}</TableCell>
                                <TableCell className="text-center  p-4 border">{formatCurrency(item.totalAmount)}</TableCell>
                                <TableCell className="text-center">
                                <button onClick={() => showModel(item?.id,item.product.productName)}>
                                    <ArrowLeftRight />
                                </button>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow  className='hover:bg-transparent border-none'>
                            <TableCell colSpan={3} className="font-medium text-gray-800 text-base">Total HT</TableCell>
                            <TableCell className="font-medium text-center text-base text-primary">{formatCurrency(purchase?.totalAmountHT)}</TableCell>   
                        </TableRow>
                        <TableRow  className='hover:bg-transparent'>
                            <TableCell colSpan={3} className="font-bold text-gray-800 text-lg">Total TCC</TableCell>
                            <TableCell className="font-bold text-center text-lg text-primary">{formatCurrency(purchase?.totalAmountTTC)}</TableCell> 
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>



        {isModalVisible && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                <div 
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={CloseModel}
                />
                <div 
                    className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Confirmer l’action pour "{produitselected}"</h3>
                        <p className="mt-2 text-sm text-gray-600">
                        Veuillez confirmer les quantités à déplacer et retourner pour le produit{" "}
                        <span className="font-medium text-gray-900">{produitselected}</span>. Cette action est irréversible.
                        </p>
                    </div>

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

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Quantité à déplacer <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                type="number"
                                name="quantityToMove"
                                placeholder="Quantité à déplacer"
                                className="w-full"
                                onChange={handleChange}
                                min={0}
                                value={formData.quantityToMove}
                            />
                            {errors.quantityToMove && (
                                <p className="text-xs text-red-500 mt-1">{errors.quantityToMove}</p>
                            )} 
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Quantité à retourner</Label>
                            <Input
                                type="number"
                                name="quantityToReturn"
                                placeholder="Quantité à retourner"
                                className="w-full"
                                onChange={handleChange}
                                min={0}
                                value={formData.quantityToReturn}
                            />
                            {errors.quantityToReturn && (
                                <p className="text-xs text-red-500 mt-1">{errors.quantityToReturn}</p>
                            )} 
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => CloseModel()}
                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                        >
                            Annuler
                        </button>
                        <Button
                            type="submit"
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                            onClick={(e) => {
                                e.preventDefault();
                                fetchMovements();
                            }}
                            disabled={issLoading}
                        >
                            {issLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    <span>En traitement...</span>
                                </div>
                                ) : (
                                "Valider"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        )}



        {isModalCreationVisible && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                <div 
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={CloseModelCreation}
                />
                
                <div 
                    className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Your existing modal content */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Ajouter un article à l'achat</h3>
                    </div>

                    {alertt?.message && (
                        <Alert
                            variant={alertt.type === "error" ? "destructive" : "success"}
                            className={`mt-4 mb-4 text-center ${
                                alertt.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                        >
                            <AlertDescription>{alertt.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Produit <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                name="productId"
                                value={formData2.productId}
                                onValueChange={(value) => handleChangee({ target: { name: 'productId', value }})}
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
                            {errorss.productId && (
                                <p className="text-xs text-red-500 mt-1">{errorss.productId}</p>
                            )} 
                        </div>

                        <div className="space-y-2">
                            <Label>Inventaire <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                name="inventoryId"
                                value={formData2.inventoryId}
                                onValueChange={(value) => handleChangee({ target: { name: 'inventoryId', value }})}
                                disabled={!formData2.productId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un inventaire" />
                                </SelectTrigger>
                                <SelectContent>
                                    {inventorys.length > 0 ? (
                                        inventorys
                                        .filter((inventory) => inventory.productId === formData2.productId)
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
                            {errorss.inventoryId && (
                                <p className="text-xs text-red-500 mt-1">{errorss.inventoryId}</p>
                            )} 
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label>Quantité <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    type="number"
                                    name="quantity"
                                    value={formData2.quantity  || ''}
                                    onChange={handleChangee}
                                    placeholder="Quantité"
                                    min="0"
                                />
                                {errorss.quantity && (
                                    <p className="text-xs text-red-500 mt-1">{errorss.quantity}</p>
                                )} 
                            </div>

                            <div className="space-y-2">
                                <Label>Prix Unitaire HT <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    type="number"
                                    name="unitPrice"
                                    value={formData2.unitPrice || ''}
                                    onChange={handleChangee}
                                    placeholder="Prix HT"
                                    step="any"
                                    min="0"
                                />
                                {errorss.unitPrice && (
                                    <p className="text-xs text-red-500 mt-1">{errorss.unitPrice}</p>
                                )} 
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Montant total <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                type="number"
                                name="totalAmount"
                                value={formData2.totalAmount || ''}
                                onChange={handleChangee}
                                placeholder="Montant total"
                                step="any"
                                min="0"
                                disabled={true}
                            />
                            {errorss.totalAmount && (
                                <p className="text-xs text-red-500 mt-1">{errorss.totalAmount}</p>
                            )} 
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => CloseModelCreation()}
                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                        >
                            Annuler
                        </button>
                        <Button
                            type="submit"
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                            onClick={(e) => {
                                e.preventDefault();
                                fetchAddItem()
                            }}
                            disabled={isssLoading}
                        >
                            {isssLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    <span>En traitement...</span>
                                </div>
                                ) : (
                                "Valider"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        )}

    </>
  )
}

export default purchase