import React, { useState,useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import {useFetchFunds} from '../../Fund/hooks/useFetchFunds'
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Loader} from 'lucide-react'



const operationSchema = z.object({
    fundId: z
    .string()
    .nonempty({ message: "Veuillez sélectionner une caisse source." }),

    transferFundId: z
        .string()
        .nonempty({ message: "Veuillez sélectionner une caisse de destination." }),


    amount: z.coerce.number({
            required_error: "Le montant est obligatoire.",
            invalid_type_error: "Le montant  est obligatoire.",
        })
        .nonnegative({ message: "Le montant doit être un nombre positif." }),

    note: z
        .string()
        .nullable()
        .optional(),

    reference : z
        .string()
        .nullable()
        .optional(),

    dateOperation:z
        .string()
        .nonempty({ message: "La date de l'opération est obligatoire." }),

    status: z
        .string()
        .nullable()
        .optional(),

});

export default function Component() {

    const navigate = useNavigate();
    const {id}=useParams()

    const { funds, totalFunds, loading, error, fetchFunds } = useFetchFunds()
    const [alert, setAlert] = useState({ message: null, type: null });
   

    useEffect(() => {
        fetchFunds ({fetchAll:true});
    }, [fetchFunds]);

    const statuses = [
        { value: 'pending', label: 'En attente' },
        { value: 'approved', label: 'Approuvé' },
    ];
      
      

    const [formData, setFormData] = useState({
        fundId: '',
        transferFundId: '',
        amount: null,
        note:null,
        reference : null,
        dateOperation:'',
        status:null,
    });

    

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const Submit = async (e) => {
        e.preventDefault();
        try {
            formData.amount = parseFloat(formData.amount);

            operationSchema.parse(formData);

            const preparedData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null && value !== "")
            );
        
            setIsLoading(true);
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/funds-operations/transfer/create`, preparedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                fundId: '',
                transferFundId: '',
                amount: null,
                note:null,
                reference : null,
                dateOperation:'',
                status:null,
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message  || 'Transfert Opération créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/transfert-operations`),
            });
            setIsLoading(false);
        } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            console.error('Error creating operation:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message[0] 
                : error.response?.data?.message || 'Erreur lors de la creation du Transfert Opération ',
                type: "error",
            });
            setIsLoading(false);
        }
        }
    };
   
  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Ajouter une nouvelle opération Transfert</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour ajouter une nouvelle opération Transfert au système.
            </p>
        </div>

        <div className="container p-0 max-w-2xl">
            <Card className="w-full border-none shadow-none">

                <CardContent className="pt-6">

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
                    <form onSubmit={Submit} className="space-y-4">


                        <div className="space-y-2">
                            <Label htmlFor="operation">Source de caisse <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                id="fundId"
                                name="fundId"
                                value={formData.fundId  || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'fundId', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez nom du fond de caisse" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {funds.length > 0 ? (
                                        funds
                                        .filter((fund) => fund.id !== formData.transferFundId)
                                            .map((fund) => (
                                                <SelectItem key={fund.id} value={fund.id}>
                                                   {fund.sku} - {fund.name}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.fundId && (
                                <p className="text-xs text-red-500 mt-1">{errors.fundId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transferFundId">Destination de caisse <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                id="transferFundId"
                                name="transferFundId"
                                value={formData.transferFundId || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'transferFundId', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez nom du fond de caisse" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {funds.length > 0 ? (
                                        funds
                                        .filter((fund) => fund.id !== formData.fundId)
                                            .map((fund) => (
                                                <SelectItem key={fund.id} value={fund.id}>
                                                   {fund.sku} - {fund.name}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.transferFundId && (
                                <p className="text-xs text-red-500 mt-1">{errors.transferFundId}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Montant <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    type='Number'
                                    id="amount"
                                    name="amount"
                                    value={formData.amount || ''}
                                    onChange={handleChange}
                                    placeholder="Entrez le maontant"
                                    min='0'
                                    step="any"
                                />
                                {errors.amount && (
                                <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reference">Référence de l'opération</Label>
                                <Input
                                    id="reference"
                                    name="reference"
                                    value={formData.reference || ''}
                                    onChange={handleChange}
                                    placeholder="Référence de l'opération"
                                
                                />
                                {errors.reference && (
                                <p className="text-xs text-red-500 mt-1">{errors.reference}</p>
                                )}
                            </div>
                            
                        </div>


                        
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                id="status"
                                name="status"
                                value={formData.status  || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'status', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le status" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {statuses.length > 0 ? (
                                        statuses
                                            .map((statuse) => (
                                                <SelectItem key={statuse.value} value={statuse.value}>
                                                    {statuse.label}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-xs text-red-500 mt-1">{errors.status}</p>
                            )}
                        </div>
                       

                        <div className="space-y-2">
                            <Label htmlFor="dateOperation">Date de l'opération <span className='text-red-500 text-base'>*</span></Label>
                            <input
                                type="datetime-local"
                                id="dateOperation"
                                name="dateOperation"
                                value={formData.dateOperation|| ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.dateOperation && (
                                <p className="text-xs text-red-500 mt-1">{errors.dateOperation}</p>
                            )}
                        </div>
                      



                        <div className="space-y-2">
                            <Label htmlFor="note">Notes</Label>
                            <textarea
                                id="note"
                                name="note"
                                value={formData.note || ""}
                                onChange={handleChange}
                                placeholder="Ajoutez des notes ici"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="2"
                            />
                            {errors.note && (
                            <p className="text-xs text-red-500 mt-1">{errors.note}</p>
                            )}
                        </div>
                        
                       

                        <div className="flex gap-4">
                            <Button type="button" onClick={() => navigate(`/dash/transfert-operations`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                Annuler
                            </Button>
                            <Button type="submit" className="w-full"  disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader className="h-4 w-4 animate-spin" />
                                        <span>Création en cours...</span>
                                    </div>
                                    ) : (
                                    "Ajouter"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </>
  );
}
