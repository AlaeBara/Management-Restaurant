import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, MapPin, Printer, Mail,Dot ,CreditCard,ArrowLeftRight,ChevronRight } from 'lucide-react'
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"


const AchatDetail = () => {





    const products = [
        { id: 1, name: 'Laptop', quantity: 2, price: 1200 },
        { id: 2, name: 'Mouse', quantity: 3, price: 50 },
        { id: 3, name: 'Keyboard', quantity: 1, price: 100 }
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD'
        }).format(value);
    };

    const total = products.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    const payments = [
        { id: 1, date: '15 juin 2023', method: 'Carte bancaire', amount: 1500 },
        { id: 2, date: '16 juin 2023', method: 'Espèces', amount: 1000 },
        { id: 3, date: '17 juin 2023', method: 'Virement', amount: 100 }
    ];
    const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);

  return (

    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-0 md:p-5 lg:p-5'>
        <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit rounded-2xl'>
            <CardHeader className='border-b border-gray-100 bg-gray-50 mb-5 rounded-tl-2xl rounded-tr-2xl'>
                <CardTitle className='text-xl lg:text-2xl font-bold text-gray-800 flex items-center'>
                    <ChevronRight className='mr-2 text-primary' />
                    Détails de l'achat
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex  flex-col space-y-2 mb-5">
                    <div className="flex items-center text-base">
                        <Dot />
                        <span className='text-black text-base mr-2 font-medium'> Référence achat: </span>
                        #1234jajs
                    </div>
                    <div className="flex items-center text-base text-nowrap">
                        <Dot />
                        <span className='text-black text-base mr-2 font-medium'>Date d'achat: </span>
                        15 juin 2023 à 15:30
                    </div>
                    <div className="flex items-center text-base">
                        <Dot />
                        <span className='text-black text-base mr-2 font-medium'>Status: </span>
                        <span>Créé</span>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow  className='hover:bg-transparent'>
                            <TableHead>Article</TableHead>
                            <TableHead className="text-center">Qté</TableHead>
                            <TableHead className="text-center">Prix</TableHead>
                            <TableHead className="text-center">Sous-total</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((item) => (
                            <TableRow key={item.id} className="font-sans font-medium">
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center  p-4">{item.quantity}</TableCell>
                                <TableCell className="text-center  p-4">{formatCurrency(item.price)}</TableCell>
                                <TableCell className="text-center  p-4">{formatCurrency(item.quantity * item.price)}</TableCell>
                                <TableCell className="text-center"><button><ArrowLeftRight/></button></TableCell>
                            </TableRow>
                        ))}
                        <TableRow  className='hover:bg-transparent'>
                            <TableCell colSpan={3} className="font-bold text-gray-800 text-lg">Total</TableCell>
                            <TableCell className="font-bold text-center text-lg text-primary">{formatCurrency(total)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>


        <div className='space-y-6 h-fit'>
            <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl'>
                <CardHeader className='border-b border-gray-100 bg-gray-50 mb-5 rounded-tl-2xl rounded-tr-2xl'>
                    <CardTitle className='text-xl lg:text-2xl font-bold text-gray-800 flex items-center'>
                        <ChevronRight className='mr-2 text-primary' />
                        Informations Fournisseur
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-base font-medium">Ayoub Baraoui</p>
                            <p className="text-sm text-muted-foreground">Fournisseur</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-base  font-medium">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>+212 33 43 43 543</span>
                        </div>
                        <div className="flex items-center space-x-4 text-base font-medium">
                            <Printer className="h-4 w-4 text-muted-foreground" />
                            <span>05 28 56 56 89</span>
                        </div>
                        <a href="mailto:baraalaeddine@gmail.com" className="flex items-center space-x-4 text-base  hover:underline font-medium">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>baraalaeddine@gmail.com</span>
                        </a>
                        <div className="flex items-center space-x-4 text-base  font-medium">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>Agadir, Hay El mohammadi</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
              
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
        </div>
    </div>
    
)
}

export default AchatDetail

