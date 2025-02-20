import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon, XIcon, ListCollapse } from 'lucide-react';
import { formatDate } from '@/components/dateUtils/dateUtils';
import { Badge } from '@/components/ui/badge';


const Tableau = ({ orders }) => {
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const showOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsModalVisible(true);
    };

    console.log(orders);

    return (
        <>
            <Card className='border-none shadow-none'>
                {/* for remove p-6 */}
                <CardContent className='p-0'>
                    <Table>
                        <TableHeader className="border bg-gray-100">
                            <TableRow className='hover:bg-transparent'>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Numéro de commande</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Montant total</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Statut de la commande</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Date</TableHead>
                                <TableHead className="p-3 text-center border text-sm text-black font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders?.length > 0 ? (
                                orders.map((order) => (
                                    <TableRow key={order.id} className="font-sans">
                                        <TableCell className="text-center p-4 border text-nowrap">{order.orderNumber}</TableCell>
                                        <TableCell className="text-center p-4 border  text-nowrap"> <Badge variant="secondary" className='text-sm rounded-full '>{Number(order.totalAmount)} Dh</Badge> </TableCell>
                                        <TableCell className="text-center p-4 border">{order.orderStatus}</TableCell>
                                        <TableCell className="text-center p-4 border text-nowrap">{formatDate(order.createdAt)}</TableCell>
                                        <TableCell className="text-center p-4 text-nowrap border">
                                            <div className="flex justify-center items-center gap-5 lg:gap-8">
                                                <button
                                                    onClick={() => showOrderDetails(order)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Voir les détails"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center p-4">
                                        Aucune commande trouvée.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal des détails de la commande */}
            {isDetailsModalVisible && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsDetailsModalVisible(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-center flex items-center gap-2"> <ListCollapse size={32} /> Détails de la commande</h3>
                            <button
                                onClick={() => setIsDetailsModalVisible(false)}
                                className="p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>


                        <div className="space-y-4">
                            <p className='text-ms'><strong className='text-gray-500'>Numéro de commande :</strong> {selectedOrder.orderNumber}</p>
                            <p className='text-ms'><strong className='text-gray-500'>Montant total :</strong> <Badge variant="secondary" className='text-sm capitalize rounded-full'>{Number(selectedOrder.totalAmount)} Dh</Badge></p>
                            <p className='text-ms'><strong className='text-gray-500'>Statut de la commande :</strong> {selectedOrder.orderStatus}</p>
                            <p className='text-ms'><strong className='text-gray-500'>Date de création :</strong> {formatDate(selectedOrder.createdAt)}</p>
                            <p className='text-ms'><strong className='text-gray-500'>Table :</strong> {selectedOrder.table?.tableName}</p>

                            <h4 className="font-semibold mt-4">Articles de la commande :</h4>

                            <div className='overflow-y-auto max-h-[300px]'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produit</TableHead>
                                            <TableHead>Prix</TableHead>
                                            <TableHead>Quantité</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedOrder.orderItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.fullLabel}</TableCell>
                                                <TableCell>{Number(item.price)} Dh</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{Number(item.total)} Dh</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Tableau;