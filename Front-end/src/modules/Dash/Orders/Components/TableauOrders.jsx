import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon } from 'lucide-react';
import { formatDate } from '@/components/dateUtils/dateUtils';

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
                <CardContent>
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
                                        <TableCell className="text-center p-4 border">{order.orderNumber}</TableCell>
                                        <TableCell className="text-center p-4 border">{Number(order.totalAmount)} Dh</TableCell>
                                        <TableCell className="text-center p-4 border">{order.orderStatus}</TableCell>
                                        <TableCell className="text-center p-4 border">{formatDate(order.createdAt)}</TableCell>
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
                        <h3 className="text-xl font-semibold mb-4 text-center">Détails de la commande</h3>
                        <div className="space-y-4">
                            <p><strong>Numéro de commande :</strong> {selectedOrder.orderNumber}</p>
                            <p><strong>Montant total :</strong> {Number(selectedOrder.totalAmount)} Dh</p>
                            <p><strong>Statut de la commande :</strong> {selectedOrder.orderStatus}</p>
                            <p><strong>Date de création :</strong> {formatDate(selectedOrder.createdAt)}</p>
                            <p><strong>Table :</strong> {selectedOrder.table?.tableName}</p>

                            <h4 className="font-semibold mt-4">Articles de la commande :</h4>
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

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsDetailsModalVisible(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Tableau;