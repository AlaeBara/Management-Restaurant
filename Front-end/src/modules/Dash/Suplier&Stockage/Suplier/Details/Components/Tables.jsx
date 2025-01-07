import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';

const Tables = () => {
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
            <Table>
                <TableHeader className="border border-gray-200">
                <TableRow className='hover:bg-transparent'>
                    <TableHead className="border">Référence</TableHead>
                    <TableHead className="text-center border">Status</TableHead>
                    <TableHead className="text-center border">Montant</TableHead>
                    <TableHead className="text-center border">Date</TableHead>
                    <TableHead className="text-center border">Action</TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
               
                    <TableRow>
                        <TableCell className="text-center p-4 border">10000</TableCell>
                        <TableCell className="text-center p-4 border">10000</TableCell>
                        <TableCell className="text-center p-4 border">10000</TableCell>
                        <TableCell className="text-center p-4 border">10000</TableCell>
                        <TableCell className="text-center p-4 border">10000</TableCell>
                    </TableRow>

               
                <TableRow className='hover:bg-transparent border-none'>
                    <TableCell colSpan={2} className="font-medium text-gray-800 text-base">Total payé</TableCell>
                    <TableCell className="font-medium text-center text-base text-primary">100000</TableCell>
                </TableRow>

               
                <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={2} className="font-bold text-gray-800 text-lg">Total Restant</TableCell>
                    <TableCell className="font-bold text-center text-lg text-primary">100000</TableCell>
                </TableRow>
                </TableBody>
            </Table>
            </CardContent>
      </Card>
    </>
  );
};

export default Tables;