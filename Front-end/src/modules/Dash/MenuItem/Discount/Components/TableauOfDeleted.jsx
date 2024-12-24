import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RotateCcw } from 'lucide-react'
import { formatDate } from '@/components/dateUtils/dateUtils'
import { useNavigate } from 'react-router-dom'

const Tableau = ({ Discounts , Restore}) => {
    const navigate = useNavigate()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [DiscountSelected , setDiscountSelected] =useState(false);

    const handleRestore = (discount) => {
        setIsModalVisible(true);
        setDiscountSelected(discount)
    };

    const confirmRestore = () => {
        Restore(DiscountSelected.id)
        setIsModalVisible(false);
    };

    const statuses = [
        { value: 'percentage', label: 'Pourcentage' },
        { value: 'fixed', label: 'Montant fixe' },
    ];

    const getStatusBadgeStyle = (isActive) => {
        return isActive ? 'bg-green-200 text-green-800 rounded px-2 py-1 text-sm font-medium' : 'bg-red-200 text-red-800 rounded px-2 py-1 text-sm font-medium';
    };


    return (
        <>
            <Card className='border-none shadow-none'>
                <CardContent>
                    <Table>
                        <TableHeader className="border bg-gray-100">
                            <TableRow className='hover:bg-transparent'>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Code Promo</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Type de réduction</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Valeur de réduction</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Statut</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Date de début</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Date de fin</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Date de création</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {
                                Discounts.length > 0 ? (
                                    Discounts.map((Discount) => (
                                        <TableRow key={Discount.id} className="font-sans">
                                            <TableCell className="text-center p-4 border">{Discount.discountSku}</TableCell>
                                            <TableCell className="text-center p-4 border"> 
                                                {
                                                    statuses.find(status => status.value === Discount.discountType)?.label
                                                }
                                            </TableCell>
                                            <TableCell className="text-center p-4 border">                                                
                                                {
                                                    Discount.discountType === 'percentage' ? 
                                                    <> 
                                                        {Discount.discountValue % 1 === 0
                                                        ? `${Number(Discount.discountValue).toFixed(0)} %`
                                                        : `${Number(Discount.discountValue).toFixed(2)} %`}
                                                    </> 
                                                    : 
                                                    <> 
                                                        {Discount.discountValue % 1 === 0
                                                        ? `${Number(Discount.discountValue).toFixed(0)} Dh`
                                                        : `${Number(Discount.discountValue).toFixed(2)} Dh`}
                                                    </>  
                                                }
                                            </TableCell>
                                            <TableCell className="text-center p-4 border">
                                                <span 
                                                    className={`
                                                        inline-block px-3 py-1 rounded-full 
                                                        ${getStatusBadgeStyle(Discount.isActive)}
                                                    `}
                                                >
                                                    {Discount.isActive ? 'Actif' : 'Inactif'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center p-4 border">{Discount.startDateTime ? formatDate(Discount.startDateTime) : '-'}</TableCell>
                                            <TableCell className="text-center p-4 border">{Discount.endDateTime ? formatDate(Discount.endDateTime) : '-'}</TableCell>
                                            <TableCell className="text-center p-4 border">{formatDate(Discount.createdAt)}</TableCell>

                                            <TableCell className="text-center p-4 text-nowrap border">
                                                <div className="flex justify-center items-center gap-5 lg:gap-8">
                                                    <button
                                                        onClick={() => handleRestore(Discount)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Supprimer"
                                                    >
                                                        <RotateCcw className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="8" className="text-center p-4">
                                            Aucun code promo trouvé.
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmer la restauration</h3>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir restaurer le code promo "{DiscountSelected.discountSku}"
                        </p>
                        <div className="mt-9 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={()=> confirmRestore()}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Restaurer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Tableau;
