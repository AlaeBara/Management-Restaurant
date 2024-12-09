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
import {useFetchFund} from '../hooks/useFetchFund'



const operationSchema = z.object({
    operation: z
        .string()
        .nonempty({ message: "L'identifiant de l'operation est obligatoire." }),
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

    const  {fund, loading, error, fetchFund} = useFetchFund(id)
   

    useEffect(() => {
        fetchFund();
    }, [fetchFund]);

    const transactionTypes = [
        { value: 'deposit', label: 'Dépôt' },
        { value: 'purchase', label: 'Achat' },
        { value: 'tip', label: 'Pourboire' },
        { value: 'withdraw', label: 'Retrait' },
        { value: 'payment', label: 'Paiement' },
        { value: 'refund', label: 'Remboursement' },
        { value: 'income', label: 'Revenu' },
        { value: 'adjustment-increase', label: 'Ajustement - Augmentation' },
        { value: 'adjustment-decrease', label: 'Ajustement - Diminution' },
        { value: 'other-income', label: 'Autre revenu' },
        { value: 'other-expense', label: 'Autre dépense' },
        { value: 'transfer-in', label: 'Transfert entrant' },
        { value: 'transfer-out', label: 'Transfert sortant' },
        { value: 'charge', label: 'Frais' },
        { value: 'chargeback', label: 'Rétrofacturation' },
        { value: 'chargeback-refund', label: 'Remboursement de rétrofacturation' },
        { value: 'chargeback-charge', label: 'Frais de rétrofacturation' }
    ];

    const statuses = [
        { value: 'pending', label: 'En attente' },
        { value: 'approved', label: 'Approuvé' },
    ];
      
      

    const [formData, setFormData] = useState({
        operation: '',
        amount: null,
        fundId: id,
        note:null,
        reference : null,
        dateOperation:'',
        status:null,
    });

    

    const [errors, setErrors] = useState({});

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
        
            
            const token = Cookies.get('access_token');
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/funds-operations`, preparedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                operation: '',
                amount: null,
                fundId: id,
                note:null,
                reference: null,
                dateOperation:'',
                status:null,
            });
            setErrors({});
            toast.success('Operation créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/caisses/detail/${id}`),
            });
        } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            const errorMessage = error.response?.data?.message || error.message;
            console.error('Error creating operation:', errorMessage);
            toast.error(errorMessage, {
            icon: '❌',
            position: "top-right",
            autoClose: 3000,
            });
        }
        }
    };
   
  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Caisse : {fund.sku} - {fund.name}</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour ajouter un nouveau opération au système.
            </p>
        </div>

        <div className="container p-0 max-w-2xl">
            <Card className="w-full border-none shadow-none">

                <CardContent className="pt-6">
                    <form onSubmit={Submit} className="space-y-4">


                        <div className="space-y-2">
                            <Label htmlFor="operation">Type de Operation <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                id="operation"
                                name="operation"
                                value={formData.operation  || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'operation', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un type de operation" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {transactionTypes.length > 0 ? (
                                        transactionTypes
                                            .map((transactionType) => (
                                                <SelectItem key={transactionType.value} value={transactionType.value}>
                                                    {transactionType.label}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.operation && (
                                <p className="text-xs text-red-500 mt-1">{errors.operation}</p>
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
                            <Button type="button" onClick={() => navigate(`/dash/caisses/detail/${id}`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                Annuler
                            </Button>
                            <Button type="submit" className="w-full">
                                Ajouter
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </>
  );
}
