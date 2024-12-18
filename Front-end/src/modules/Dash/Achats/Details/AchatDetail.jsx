import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, MapPin, Printer, Mail,Dot ,CreditCard,ArrowLeftRight,ChevronRight ,Ban,ArrowLeft ,Loader} from 'lucide-react'
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import {usePurchase} from './hooks/useFetchPurchase'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '@/components/Spinner/Spinner'
import {formatDate}  from '@/components/dateUtils/dateUtils'
import {useMovements} from './hooks/useMovements'


const AchatDetail = () => {

    const navigate = useNavigate()

    const [isModalVisible ,setIsModalVisible] =useState(false)

    const { id } = useParams();
    const { purchase, isLoading, error, fetchPurchase } = usePurchase();

    useEffect(() => {
        fetchPurchase(id);
    }, [id]);

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

    const payments = [
        { id: 1, date: '15 juin 2023', method: 'Carte bancaire', amount: 1500 },
        { id: 2, date: '16 juin 2023', method: 'Espèces', amount: 1000 },
        { id: 3, date: '17 juin 2023', method: 'Virement', amount: 100 }
    ];
    const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);

    const [formData, setFormData] = useState({
        quantityToMove: '',
        quantityToReturn: '',
    });

    const [idSelected, setIdSelected] = useState(null);

    const showModel =(id)=>{
        setIsModalVisible(true);
        setIdSelected(id)
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

        <ToastContainer />
        <div className="sm:pl-0 md:pl-5 lg:pl-5 " onClick={()=>navigate('/dash/achats')}>
            <Button  variant="outline" size="ms" className='border-0 shadow-none hover:bg-transparent'>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux achats
            </Button>
        </div>

        {isLoading ? (
            <div className='flex items-center justify-center h-full'>
                <Spinner title="Chargement des Catégories..." />
            </div>
            ) : error ? (
            <div className='flex flex-col items-center justify-center h-full'>
                <Ban className="w-[80px] h-[80px] text-[#f44336] mb-[20px]" />
                <span>{error}</span>
            </div>
            ) : (

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
                            <span className='text-black text-base mr-2 font-medium'> Référence achat :</span>
                            {purchase?.ownerReferenece}
                        </div>
                        <div className="flex items-center text-base text-nowrap">
                            <Dot />
                            <span className='text-black text-base mr-2 font-medium'>Date d'achat :</span>
                            {formatDate(purchase?.purchaseDate)}
                        </div>
                        <div className="flex items-center text-base">
                            <Dot />
                            <span className='text-black text-base mr-2 font-medium'>Status :</span>
                            <span>{StatusToFrench(purchase?.status)}</span>
                        </div>
                        <div className="flex items-center text-base">
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
                                    <button onClick={() => showModel(item?.id)}>
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
                                <AvatarFallback>{purchase?.supplier?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-base font-medium">{purchase?.supplier?.name}</p>
                                <p className="text-sm text-muted-foreground">Fournisseur</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4 text-base  font-normal">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{purchase?.supplier?.phone}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-base font-normal">
                                <Printer className="h-4 w-4 text-muted-foreground" />
                                <span>{purchase?.supplier?.fax}</span>
                            </div>
                            <a href="mailto:baraalaeddine@gmail.com" className="flex items-center space-x-4 text-base  hover:underline font-normal">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{purchase?.supplier?.email}</span>
                            </a>
                            <div className="flex items-center space-x-4 text-base  font-normal">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{purchase?.supplier?.address}</span>
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



        {isModalVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Confirmer la suppression</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Êtes-vous sûr de vouloir supprimer cette Unité ?
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
                                    <span>Valider en cours...</span>
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

export default AchatDetail

