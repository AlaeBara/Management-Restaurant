import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrashIcon,PencilIcon , Minus } from 'lucide-react'
import { formatDate } from '@/components/dateUtils/dateUtils'
import { useNavigate } from 'react-router-dom'

const Tableau = ({produits}) => {
    const navigate = useNavigate()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [produitSelected , setproduitSelected] =useState(false);

    const handleDelete = (produit) => {
        setIsModalVisible(true);
        setproduitSelected(produit)
    };

    const confirmDelete = () => {
        deleteproduit(produitSelected.id)
        setIsModalVisible(false);
    };

    
    return (
        <>
            <Card className='border-none shadow-none'>
                <CardContent>
                    <Table>
                        <TableHeader className="border bg-gray-100">
                            <TableRow className='hover:bg-transparent'>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Nom de Produit</TableHead>
                                {/* <TableHead className="p-3 text-center border text-sm text-black font-bold">Prix</TableHead> */}
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Prix</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Quantité</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Date de création</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {
                                produits.length > 0 ? (
                                    produits.map((produit) => (
                                        <TableRow key={produit.id} className="font-sans">
                                            <TableCell className="text-center p-4 border">{produit.translates[0].name}</TableCell>
                                            <TableCell className="text-center p-4 border">
                                                {produit?.price?.discount?.status === 'noDiscount' ? (
                                                    <div className="font-medium">
                                                        {parseFloat(produit?.price?.finalPrice).toFixed(2)} Dh
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        {produit?.discountLevel !== 'noDiscount' && produit?.discountValue !== null && (
                                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                                <Minus className="w-3 h-3 mr-1" />
                                                                {Number(produit?.discountValue)}
                                                                {produit?.discountMethod === 'fixed' ? "Dh" : "%"}
                                                            </span>
                                                        )}
                                                        <span className="font-medium">
                                                            {parseFloat(produit?.basePrice).toFixed(2)} Dh
                                                        </span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center p-4 border">{produit.quantity}</TableCell>
                                            <TableCell className="text-center p-4 border">{formatDate(produit.createdAt)}</TableCell>

                                            <TableCell className="text-center p-4 text-nowrap border">
                                                <div className="flex justify-center items-center gap-5 lg:gap-8">
                                                    <button
                                                        onClick={() => navigate(`#`)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Modifier"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        // onClick={() => handleDelete(produit)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Supprimer"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="8" className="text-center p-4">
                                            Aucun Produit menu trouvé.
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
                        <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir supprimer le code promo "{produitSelected.produitSku}"
                        </p>
                        <div className="mt-9 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={()=> confirmDelete()}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Tableau;
