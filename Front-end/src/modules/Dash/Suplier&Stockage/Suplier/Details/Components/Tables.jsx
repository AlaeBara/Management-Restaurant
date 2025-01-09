import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useFetchPurchasesWithSuppleir } from '../hooks/fetchPurchaseWithSupplier';
import Spinner from '@/components/Spinner/Spinner';

const Tables = () => {
    const { id } = useParams();
    const { supplierPurchases, loading, error, fetchPurchasesWithSuppleir } = useFetchPurchasesWithSuppleir(id);

    useEffect(() => {
        fetchPurchasesWithSuppleir();
    }, [fetchPurchasesWithSuppleir]);

    const getStatusStyle = (status) => {
        const normalizedStatus = status ? status.toUpperCase().trim() : '';
        switch (normalizedStatus) {
            case 'PAID':
                return {
                    label: 'Payé',
                    className: ' px-3 py-1 rounded-full bg-green-200 text-green-800 rounded px-2 py-1 text-sm font-medium'
                };
            case 'UNPAID':
                return {
                    label: 'Non payé',
                    className: 'px-3 py-1 rounded-full bg-red-200 text-red-800 rounded px-2 py-1 text-sm font-medium'
                };
            default:
                return {
                    label: '-',
                    className: 'text-sm font-medium'
                };
        }
    };


  return (
    <>
      <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl h-fit'>
        <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-100 bg-gray-50 rounded-tl-2xl rounded-tr-2xl p-4 mb-5'>
            <CardTitle className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center'>
                <ChevronRight className='mr-2 text-primary' />
                Historique des paiements
            </CardTitle>
        </CardHeader>

        <CardContent>
            {loading ? (
                <>
                    <Spinner/>
                    <div className="text-center">Chargement des données...</div>
                </>
            ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
            ) : supplierPurchases.length === 0 ? (
                <div className="text-center py-4">Aucun historique de paiement trouvé.</div>
            ) : (
            <Table>
                <TableHeader className="border border-gray-200">
                    <TableRow className='hover:bg-transparent'>
                        <TableHead className="text-center border">Référence</TableHead>
                        <TableHead className="text-center border">Status</TableHead>
                        <TableHead className="text-center border">Montant</TableHead>
                        <TableHead className="text-center border">Date de paiement</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {supplierPurchases.map((purchase) =>
                        purchase.purchasePaiements?.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell className="text-center p-4 border">{payment.reference || "-"}</TableCell>
                                <TableCell className="text-center p-4 border text-nowrap">
                                    <span className={getStatusStyle(payment.status).className}>
                                        {getStatusStyle(payment.status).label}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center p-4 border"> {parseFloat(payment.amount)} Dh</TableCell>
                                <TableCell className="text-center p-4 border">{payment.datePaiement || '-'}</TableCell>
                            </TableRow>
                        ))
                    )}

                    <TableRow className='hover:bg-transparent border-none'>
                        <TableCell colSpan={2} className="font-medium text-gray-800 text-base">Total payé</TableCell>
                        <TableCell className="font-medium text-center text-base text-primary">{supplierPurchases[0].totalPaidAmount} DH</TableCell>
                    </TableRow>

                    <TableRow className='hover:bg-transparent'>
                        <TableCell colSpan={2} className="font-bold text-gray-800 text-lg">Total Restant</TableCell>
                        <TableCell className="font-bold text-center text-lg text-primary">{supplierPurchases[0].totalRemainingAmount} DH</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Tables;