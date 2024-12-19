import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {CreditCard,ChevronRight } from 'lucide-react'



const Payment = () => {
    
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD'
        }).format(value);
    };

    const payments = [
        { id: 1, date: '15 juin 2023', method: 'Carte bancaire', amount: 1500 },
        { id: 2, date: '16 juin 2023', method: 'Espèces', amount: 1000 },
        { id: 3, date: '17 juin 2023', method: 'Virement', amount: 100 }
    ];

    const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);
return (
    <>

        <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl'>
            <CardHeader className='border-b border-gray-100 bg-gray-50 rounded-tl-2xl rounded-tr-2xl'>
                <CardTitle className='text-xl lg:text-2xl font-bold text-gray-800  flex items-center'>
                    <ChevronRight className='mr-2 text-primary' />
                    Historique des paiements
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-transparent'>
                            <TableHead className="text-center">Date</TableHead>
                            <TableHead className="text-center">Méthode</TableHead>
                            <TableHead className="text-center">Montant</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id} className="font-sans font-medium">
                                <TableCell className="text-center  p-4 text-nowrap">{payment.date}</TableCell>
                                <TableCell className="flex items-center justify-center p-4 text-nowrap">
                                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {payment.method}
                                </TableCell>
                                <TableCell className="text-center p-4">{formatCurrency(payment.amount)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className='hover:bg-transparent'>
                            <TableCell colSpan={2} className="font-bold p-4  text-lg">Total payé</TableCell>
                            <TableCell className="font-bold text-center  text-lg">{formatCurrency(totalPaid)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>


    </>
  )
}

export default Payment