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
import { useNavigate } from 'react-router-dom';
import {useFetchFunds} from '../../Fund/hooks/useFetchFunds'
import {useFetchTypeDepense} from '../hooks/useFetchTypeDepense'
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Loader , Plus , Trash , Edit } from 'lucide-react'



const operationSchema = z.object({
   
    fundId:z
        .string()
        .nonempty({ message: "La caisse est obligatoire." }),

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

    expenseTypeId : z
        .string()
        .nonempty({ message: "Le type est obligatoire." }),

});


export default function Component() {

    const navigate = useNavigate();
    const { funds, totalFunds, loading, error, fetchFunds } = useFetchFunds()
    const {Types, totalTypes, fetchTypeDepense} = useFetchTypeDepense()
    
    const [alert, setAlert] = useState({ message: null, type: null });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newExpenseTypeName, setNewExpenseTypeName] = useState('');
    const [newExpenseTypeError, setNewExpenseTypeError] = useState('');

    const [formData, setFormData] = useState({
        amount: null,
        fundId: '',
        note:null,
        reference : null,
        dateOperation:'',
        status:null,
        expenseTypeId: '',
    });

    useEffect(() => {
        fetchFunds ({fetchAll:true});
        fetchTypeDepense({fetchAll:true});
    }, [fetchFunds]);

    
    const statuses = [
        { value: 'pending', label: 'En attente' },
        { value: 'approved', label: 'Approuvé' },
    ];
      
        

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
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/funds-operations/expense`, preparedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                amount: null,
                fundId: '',
                note:null,
                reference : null,
                dateOperation:'',
                status:null,
                expenseTypeId: '',
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message  ||  'Dépense créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/dépenses`),
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
            console.error('Error creating operation - expense :',error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message[0] 
                : error.response?.data?.message || 'Erreur lors de la creation du dépense',
                type: "error",
            });
            setIsLoading(false);
        }
        }
    };


    const handleAddExpenseType = async () => {
        if (!newExpenseTypeName) {
            setNewExpenseTypeError('Le nom du type de dépense est obligatoire.');
            return;
        }
        setNewExpenseTypeError('');
        try {
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/expense-types`, { name: newExpenseTypeName }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTypeDepense({fetchAll:true});
            formData.expenseTypeId = response.data.id;
            setNewExpenseTypeName('');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding expense type:', error.response?.data?.message || error.message);
            const serverErrorMessage = error.response?.data?.message || 'Erreur lors de l\'ajout du type de dépense';
            toast.error(serverErrorMessage); 
        }
    };

    const [selectedExpenseType, setSelectedExpenseType] = useState({ id: null, name: '' });

    const handleUpdateExpenseType = async () => {
        if (!selectedExpenseType.name) {
            setNewExpenseTypeError('Le nom du type de dépense est obligatoire.');
            return;
        }
        setNewExpenseTypeError('');
        try {
            const token = Cookies.get('access_token');
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/expense-types/${selectedExpenseType.id}`,
                { name: selectedExpenseType.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTypeDepense({ fetchAll: true });
            setIsModalOpen(false);
            setSelectedExpenseType({ id: null, name: '' });
            toast.success('Type de dépense modifié avec succès!');
        } catch (error) {
            console.error('Error updating expense type:', error.response?.data?.message || error.message);
            const serverErrorMessage = error.response?.data?.message || 'Erreur lors de la modification du type de dépense';
            toast.error(serverErrorMessage);
        }
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [expenseTypeToDelete, setExpenseTypeToDelete] = useState(null);
    const handleDeleteExpenseType = async () => {
        if (!expenseTypeToDelete) return;
    
        try {
            const token = Cookies.get('access_token');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/expense-types/${expenseTypeToDelete.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTypeDepense({ fetchAll: true });
            setFormData((prevFormData) => ({
                ...prevFormData,
                expenseTypeId: '', 
            }));
            setIsDeleteModalOpen(false);
            setExpenseTypeToDelete(null);
            toast.success('Type de dépense supprimé avec succès!');
        } catch (error) {
            console.error('Error deleting expense type:', error.response?.data?.message || error.message);
            const serverErrorMessage = error.response?.data?.message || 'Erreur lors de la suppression du type de dépense';
            toast.error(serverErrorMessage);
        }
    };


   
  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau dépense</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour ajouter un nouveau dépense au système.
            </p>
        </div>

        <div className="container p-0 max-w-2xl">
            <Card className="w-full border-none shadow-none">

                <CardContent className="pt-6 p-3 sm:p-6">

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
                            <Label htmlFor="operation">Nom du fond de caisse  <span className='text-red-500 text-base'>*</span></Label>
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
                            <Label htmlFor="expenseTypeId">Type de dépense <span className='text-red-500 text-base'>*</span></Label>
                            <div className="flex items-center gap-1">
                                <Select
                                    key={formData.expenseTypeId || "default"}
                                    id="expenseTypeId"
                                    name="expenseTypeId"
                                    value={formData.expenseTypeId || ""}
                                    onValueChange={(value) => handleChange({ target: { name: 'expenseTypeId', value : value || '' } })}
                                   defaultValue="annule"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un type de dépense" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-48 overflow-y-auto">
                                        <SelectItem value={null} className="text-red-500" >Annulé</SelectItem>
                                        {Types.length > 0 ? (
                                            Types.map((et) => (
                                                <SelectItem key={et.id} value={et.id}>
                                                    {et.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <p className='text-sm'>Aucune donnée disponible</p>
                                        )}
                                    </SelectContent>
                                </Select>
                                {!formData.expenseTypeId && 
                                    <Button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <Plus/>
                                    </Button>
                                }

                                {formData.expenseTypeId && 
                                    <>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const selectedType = Types.find((et) => et.id === formData.expenseTypeId);
                                                if (selectedType) {
                                                    setExpenseTypeToDelete(selectedType); 
                                                    setIsDeleteModalOpen(true); 
                                                }
                                            }}
                                            className="bg-transparent hover:bg-transparent p-2 border border-red-500"
                                        >
                                            <Trash className='text-red-500' />
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const selectedType = Types.find((et) => et.id === formData.expenseTypeId);
                                                if (selectedType) {
                                                    setSelectedExpenseType({ id: selectedType.id, name: selectedType.name });
                                                    setIsModalOpen(true);
                                                }
                                            }}
                                            className='p-2'
                                        >
                                            <Edit />
                                        </Button>
                                    </>
                                }
                            </div>
                            {errors.expenseTypeId && (
                                <p className="text-xs text-red-500 mt-1">{errors.expenseTypeId}</p>
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
                            <Button type="button" onClick={() => navigate(`/dash/dépenses`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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


        {isModalOpen && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                <div 
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={() => {
                        setIsModalOpen(false);
                        setSelectedExpenseType({ id: null, name: '' }); 
                    }}
                />
                
                <div 
                    className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4">
                        <h2 className="text-lg font-bold mb-4">
                            {selectedExpenseType.id ? "Modifier le type de dépense" : "Ajouter un nouveau type de dépense"}
                        </h2>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
                        <div className="bg-white rounded-lg space-y-2">
                            <Label>Nom du type de dépense <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                type="text"
                                value={selectedExpenseType.id ? selectedExpenseType.name : newExpenseTypeName}
                                onChange={(e) => {
                                    if (selectedExpenseType.id) {
                                        setSelectedExpenseType({ ...selectedExpenseType, name: e.target.value });
                                    } else {
                                        setNewExpenseTypeName(e.target.value);
                                        setNewExpenseTypeError('');
                                    }
                                }}
                                placeholder="Entrez le nom du type de dépense"
                                className="mb-4"
                            />
                            {newExpenseTypeError && (
                                <p className="text-xs text-red-500 mb-2">{newExpenseTypeError}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => {
                                setIsModalOpen(false);
                                setSelectedExpenseType({ id: null, name: '' });
                            }}>
                                Annuler
                            </Button>
                            <Button type="button" onClick={selectedExpenseType.id ? handleUpdateExpenseType : handleAddExpenseType}>
                                {selectedExpenseType.id ? "Modifier" : "Ajouter"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {isDeleteModalOpen && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                <div 
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={() => setIsDeleteModalOpen(false)}
                />
                
                <div 
                    className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4">
                        <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
                        <p className="text-ms text-gray-600">
                            Êtes-vous sûr de vouloir supprimer le type de dépense "{expenseTypeToDelete?.name}" ?
                        </p>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="button" onClick={handleDeleteExpenseType} className="bg-red-500 hover:bg-red-600">
                            Supprimer
                        </Button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
}
