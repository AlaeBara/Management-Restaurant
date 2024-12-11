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
import {useFetchInfoInventoryAdjustments} from '../../../Products/DetailsProduct/hooks/useFetchInfoInventory'
import { Alert, AlertDescription } from '@/components/ui/alert';




const InventoriesMovements = z.object({
    inventoryId: z
        .string()
        .nonempty({ message: "L'identifiant de l'inventaire est obligatoire." }),
    quantity: z.coerce.number({
            required_error: "La quantité  est obligatoire.",
            invalid_type_error: "La quantité  est obligatoire.",
        })
        .nonnegative({ message: "La quantité doit être un nombre positif." }),

    movementType:z
        .string()
        .nonempty({ message: "Le type de mouvement est obligatoire." }),

    movementAction:z.string()
        .nullable()
        .optional(),
    
    movementDate: z
        .string()
        .nullable()
        .optional(),

    notes: z
        .string()
        .max(255, { message: "Les notes doivent contenir au maximum 255 caractères." })
        .nullable()
        .optional(),

    reason: z
        .string()
        .max(255, { message: "La raison doit contenir au maximum 255 caractères." })
        .nullable()
        .optional(),
});


export default function Component() {

    const navigate = useNavigate();
    const {id}=useParams()

    const [alert, setAlert] = useState({ message: null, type: null });

    const {inventory, iSloading, message, fetchIventoryAdjustments } = useFetchInfoInventoryAdjustments(id)

    useEffect(() => {
        fetchIventoryAdjustments();
    }, []);

    const [formData, setFormData] = useState({
        inventoryId: id,
        quantity: null,
        movementType:'',
        movementAction: null,
        movementDate: null,
        notes:null,
        reason:null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const validateCategoryForm = (formData) => {
        const errors = {};
        if (formData.movementType == 'inventory_count' || formData.movementType == 'adjustment') {
            if (!formData.movementAction || formData.movementAction === null) {
                errors.movementAction = "Le type d'action du mouvement requise lorsque Type de Mouvement est Ajustement et Inventaire comptage.";
            }
        }
    
        return errors;
    };


    const Submit = async (e) => {
        e.preventDefault();
        try {

            if (formData.movementType !== 'inventory_count' && formData.movementType !== 'adjustment') {
                formData.movementAction = null;
            }
            
            const timeValidationErrors = validateCategoryForm(formData);
            if (Object.keys(timeValidationErrors).length > 0) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...timeValidationErrors
                }));
                return;
            }
            formData.quantity = parseFloat(formData.quantity);

            const preparedData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null)
            );

            preparedData.quantity = parseFloat(preparedData.quantity);
            InventoriesMovements.parse(preparedData);

            console.log(preparedData)
            const token = Cookies.get('access_token');
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/inventories-movements`, preparedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                inventoryId: id,
                quantity: null,
                movementType:'',
                movementAction:null,
                movementDate: null,
                notes:null,
                reason:null,
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message || 'Mouvement Inventaire créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/inventaires`),
            });
        } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            console.error('Error creating Inventories Movements:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message[0] 
                : error.response?.data?.message || 'Erreur lors de la creation du inventaire mouvement',
                type: "error",
            });
        }
        }
    };
    const movementTypes = [
        { value: 'allocation_product', label: 'Allocation de produit' },
        { value: 'wastage', label: 'Gaspillage' },
        { value: 'supplier_return', label: 'Retour fournisseur' },
        { value: 'adjustment', label: 'Ajustement' },
        { value: 'inventory_count', label: 'Inventaire comptage' },
        { value: 'inventory_initial', label: 'Inventaire initial' }
    ];

  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Inventaire : {inventory.sku} - {inventory.productName}</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour effectuer un ajustement d'inventaire.
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
                            <Label htmlFor="movementType">Type de Mouvement <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                id="movementType"
                                name="movementType"
                                value={formData.movementType  || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'movementType', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un type de mouvement" />
                                </SelectTrigger>
                                <SelectContent>
                                    {movementTypes.length > 0 ? (
                                        movementTypes
                                            .map((movementType) => (
                                                <SelectItem key={movementType.value} value={movementType.value}>
                                                    {movementType.label}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.movementType && (
                                <p className="text-xs text-red-500 mt-1">{errors.movementType}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="movementAction">Le type d'action du mouvement</Label>
                            <Select value={formData.movementAction || ""}   
                                onValueChange={(value) => handleChange({ target: { name: 'movementAction', value } })}
                                disabled={
                                    formData.movementType  !== 'inventory_count' && 
                                    formData.movementType  !== 'adjustment'
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez type d'action du mouvement">
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="increase">Augmenter</SelectItem>
                                    <SelectItem value="decrease">Diminuer</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.movementAction && (
                                <p className="text-xs text-red-500 mt-1">{errors.movementAction}</p>
                            )}
                        </div>
                    
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantité {inventory.productUnit ? `(${inventory.productUnit})` : ""} <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                type='Number'
                                id="quantity"
                                name="quantity"
                                value={formData.quantity || ''}
                                onChange={handleChange}
                                placeholder="Entrez la quantité"
                                min='0'
                                step="any"
                            />
                            {errors.quantity && (
                            <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="storageId">Date de movement</Label>
                            <input
                                type="datetime-local"
                                id="movementDate"
                                name="movementDate"
                                value={formData.movementDate || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <p className="text-xs text-gray-600 mt-0">
                                Sélectionnez la date et l'heure du mouvement d'inventaire.
                            </p>
                            {errors.storageId && (
                                <p className="text-xs text-red-500 mt-1">{errors.storageId}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes || ""}
                                onChange={handleChange}
                                placeholder="Ajoutez des notes ici"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="2"
                            />
                            {errors.notes && (
                            <p className="text-xs text-red-500 mt-1">{errors.notes}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Raison</Label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason || ""}
                                onChange={handleChange}
                                placeholder="Ajoutez une raison ici"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="2"
                            />
                            {errors.reason && (
                            <p className="text-xs text-red-500 mt-1">{errors.reason}</p>
                            )}
                        </div>
                        
                        <div className="flex gap-4">
                            <Button type="button" onClick={() => navigate(`/dash/inventaires`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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
