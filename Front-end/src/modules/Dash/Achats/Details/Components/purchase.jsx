import React, { useState } from 'react'
import {Dot ,ArrowLeftRight,ChevronRight ,Ban,ArrowLeft ,Loader} from 'lucide-react'
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import {formatDate}  from '@/components/dateUtils/dateUtils'
import {useMovements} from '../hooks/useMovements'


const purchase = ({purchase}) => {
    const [isModalVisible ,setIsModalVisible] =useState(false)

    function StatusToFrench(status) {
        if (typeof status !== 'string') {
            return 'Status not available'; 
        }
        const statusTranslations = {
            'CREATED': 'Créé',
            'CONFIRMED': 'Confirmé',
            'DELIVERING': 'En livraison',
            'CANCELLED': 'Annulé',
            'COMPLETED': 'Terminé',
        };
        return statusTranslations[status.toUpperCase()] || status;
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
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { issLoading , alert, errors, fetchMovements } = useMovements(idSelected , formData ,CloseModel)

  return (
    <>

        <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit rounded-2xl'>
            <CardHeader className='border-b border-gray-100 bg-gray-50 mb-5 rounded-tl-2xl rounded-tr-2xl'>
                <CardTitle className='text-xl lg:text-2xl font-bold text-gray-800 flex items-center'>
                    <ChevronRight className='mr-2 text-primary' />
                    Détails de l'achat
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex  flex-col space-y-2 mb-5">
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
                        <span>{StatusToFrench(purchase?.status)}</span>
                    </div>
                    <div className="flex text-base">
                        <Dot />
                        <span className='text-black text-base mr-2 font-medium'>Tax :</span>
                        <span> {purchase?.taxPercentage} %</span>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow  className='hover:bg-transparent'>
                            <TableHead>Produit</TableHead>
                            <TableHead className="text-center">Qté</TableHead>
                            <TableHead className="text-center">Prix</TableHead>
                            <TableHead className="text-center">Sous-total</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchase?.purchaseItems.map((item) => (
                            <TableRow key={item.id} className="font-sans font-medium">
                                <TableCell>{item.product.productName}</TableCell>
                                <TableCell className="text-center  p-4">{item.quantity}</TableCell>
                                <TableCell className="text-center  p-4">{formatCurrency(item.unitPrice)}</TableCell>
                                <TableCell className="text-center  p-4">{formatCurrency(item.totalAmount)}</TableCell>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4">
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
    
    
    </>
  )
}

export default purchase