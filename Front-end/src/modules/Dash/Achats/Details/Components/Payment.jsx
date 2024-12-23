import React ,{useState} from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {ChevronRight,Plus ,Loader } from 'lucide-react'
import {formatDate}  from '@/components/dateUtils/dateUtils'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {useCreatePayment} from '../hooks/useCreatePayment'
import { useParams } from 'react-router-dom'
import {useConfirmPayment} from '../hooks/useConfirmPayment'


const Payment = ({purchase , fetchPurchase}) => {
    
    const {id} = useParams()
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD'
        }).format(value);
    };

    const [isModalVisible ,setIsModalVisible] =useState(false)

    const showModel =()=>{
        setIsModalVisible(true);
    }

    const [formData, setFormData] = useState({
        amount: '',
        status: '',
        reference:'',
        datePaiement:''
    });

    const CloseModel =()=>{
        setIsModalVisible(false);
        setFormData({
            amount: '',
            status: '',
            reference:'',
            datePaiement:''
        })
        resetErrors()
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { issLoading, alert, errors,  fetchCreatePayment , resetErrors} = useCreatePayment(id , formData ,CloseModel ,fetchPurchase)

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

    const {ConfirmPayment} =useConfirmPayment(fetchPurchase , id)

    const [isModalPaymentVisible ,setIsModalPaymentVisible] =useState(false)
    const [idPayment ,setIdPayment] =useState(false)

    const handleConfirm = (id) => {
        setIsModalPaymentVisible(true);
        setIdPayment(id)
    };

    const confirm = (id) => {
        setIsModalPaymentVisible(false)
        ConfirmPayment(idPayment)
    };
      
      

return (
    <>

        <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl'>
            <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-100 bg-gray-50 rounded-tl-2xl rounded-tr-2xl p-4 mb-5'>
                <CardTitle className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center'>
                    <ChevronRight className='mr-2 text-primary' />
                    Historique des paiements
                </CardTitle>

                {purchase?.totalRemainingAmount !== '0.00' &&

                    <Button
                        type="submit"
                        className="w-full sm:w-auto rounded-md bg-black px-4 py-2 text-sm font-medium text-white whitespace-nowrap"
                        onClick={showModel}
                    >
                        <Plus className='mr-2 h-4 w-4'/> Ajouter Paiement
                    </Button>
                }
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader className="border border-gray-200">
                        <TableRow className='hover:bg-transparent'>
                            <TableHead className=" border">Référence</TableHead>
                            <TableHead className="text-center border">Status</TableHead>
                            <TableHead className="text-center border">Montant</TableHead>
                            <TableHead className="text-center border">Date</TableHead>
                            <TableHead className="text-center border">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {
                            purchase?.purchasePaiements && purchase.purchasePaiements.length > 0 ? (
                                purchase.purchasePaiements.map((payment) => (
                                <TableRow key={payment.id} className="font-sans font-medium">
                                    <TableCell className=" p-4 border">{payment.reference || "-"}</TableCell>
                                    <TableCell className="flex items-center justify-center p-4 text-nowrap">
                                        <span className={getStatusStyle(payment.status).className}>
                                            {getStatusStyle(payment.status).label}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center p-4 border">{formatCurrency(payment.amount)}</TableCell>
                                    <TableCell className="text-center  p-4 text-nowrap border">{payment.datePaiement ? formatDate(payment.datePaiement) : "-"}</TableCell>
                                    <TableCell className="text-center  p-4 text-nowrap border">
                                        {payment.status === 'paid' ?
                                          <span> Validé </span> 
                                        :
                                            <Button
                                                type="submit"
                                                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white whitespace-nowrap"
                                                onClick={()=>handleConfirm(payment.id)}
                                            >
                                                Valider Paiement
                                            </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center p-4">
                                        Aucun paiement trouvé.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        <TableRow  className='hover:bg-transparent border-none'>
                            <TableCell colSpan={2} className="font-medium text-gray-800 text-base">Total payé</TableCell>
                            <TableCell className="font-medium text-center text-base text-primary">{formatCurrency(purchase?.totalPaidAmount)}</TableCell>   
                        </TableRow>
                        <TableRow  className='hover:bg-transparent'>
                            <TableCell colSpan={2} className="font-bold text-gray-800 text-lg">Total Restant</TableCell>
                            <TableCell className="font-bold text-center text-lg text-primary">{formatCurrency(purchase?.totalRemainingAmount)}</TableCell> 
                        </TableRow>
                        
                    </TableBody>
                </Table>
            </CardContent>
        </Card>


        {isModalVisible && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                <div 
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={CloseModel}
                />
                
                <div 
                    className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Ajouter un nouveau paiement</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Veuillez entrer les détails du paiement ci-dessous. Cette action est irréversible.
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

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                                    Montant <span className='text-red-500 text-base'>*</span>
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    placeholder="Montant"
                                    className="w-full"
                                    onChange={handleChange}
                                    min={0}
                                    value={formData.amount}
                                />
                                {errors.amount && (
                                    <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                                )} 
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                    Statut
                                </Label>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onValueChange={(value) => handleChange({ target: { name: 'status', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un  status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formData.status ==='' || <SelectItem value={null}>Aucun</SelectItem>}
                                        <SelectItem value="paid">Payé</SelectItem>
                                        <SelectItem value="unpaid">Non payé</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-xs text-red-500 mt-1">{errors.status}</p>
                                )} 
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reference" className="text-sm font-medium text-gray-700">
                                    Référence
                                </Label>
                                <Input
                                    id="reference"
                                    name="reference"
                                    placeholder="Référence"
                                    className="w-full"
                                    onChange={handleChange}
                                    value={formData.reference}
                                />
                                {errors.reference && (
                                    <p className="text-xs text-red-500 mt-1">{errors.reference}</p>
                                )} 
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="datePaiement" className="text-sm font-medium text-gray-700">
                                    Date de paiement
                                </Label>
                                <input
                                    type="datetime-local"
                                    id="datePaiement"
                                    name="datePaiement"
                                    value={formData.datePaiement}
                                    onChange={handleChange}
                                    className="w-full p-1  border border-gray-200 rounded-md"
                                />
                                {errors.datePaiement && (
                                    <p className="text-xs text-red-500 mt-1">{errors.datePaiement}</p>
                                )} 
                            </div>
                        </div>


                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={CloseModel}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <Button
                                type="submit"
                                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                                onClick={(e) => {
                                    e.preventDefault();
                                    fetchCreatePayment();
                                }}
                                disabled={issLoading}
                            >
                                {issLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader className="h-4 w-4 animate-spin" />
                                        <span>En traitement...</span>
                                    </div>
                                    ) : (
                                    "Ajouter"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}


            {isModalPaymentVisible  && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                >
                    <div 
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={()=>setIsModalPaymentVisible(false)}
                    />
                        <div 
                            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Valider un Paiement</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                Veuillez confirmer les détails du paiement ci-dessous. Une fois validé, cette action ne peut pas être annulée.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={()=>setIsModalPaymentVisible(false)}
                                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                                >
                                    Annuler
                                </button>

                                <Button
                                    type="submit"
                                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                                    onClick={() => confirm()}
                                >
                                    Confirmer Paiement
                                </Button>
                            </div>
                        </div>
                    </div>
            )}
    </>
  )
}

export default Payment