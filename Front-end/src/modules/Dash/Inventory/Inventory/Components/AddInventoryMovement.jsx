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
import {useFetchIventory} from '../../../Inventory/Inventory/Hooks/useFetchIventory'



const InventoriesMovements = z.object({
    inventoryId: z
        .string()
        .nonempty({ message: "L'identifiant de l'inventaire est obligatoire." }),

    destinationInventoryId: z
        .string()
        .nullable()
        .optional(),

    quantity: z.coerce.number({
            required_error: "La quantité  est obligatoire.",
            invalid_type_error: "La quantité  est obligatoire.",
        })
        .nonnegative({ message: "La quantité doit être un nombre positif." }),

    movementType:z
        .string()
        .nonempty({ message: "Le type de mouvement est obligatoire." }),
    
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

export { InventoriesMovements };


export default function Component() {

    const navigate = useNavigate();
    const {id}=useParams()

    const {inventory, iSloading, message, fetchIventoryAdjustments } = useFetchInfoInventoryAdjustments(id)
    const { inventorys, loading: inventoryLoading, error: inventoryError, fetchIventory } = useFetchIventory();

    useEffect(() => {
        fetchIventoryAdjustments();
        fetchIventory({fetchAll:true})
    }, []);

    const [formData, setFormData] = useState({
        inventoryId: id,
        destinationInventoryId: null,
        quantity: null,
        movementType:'',
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
        if (formData.movementType == 'transfer_in' || formData.movementType == 'transfer_out') {
            // Validate start time
            if (!formData.destinationInventoryId || formData.destinationInventoryIddestinationInventoryId === null) {
                errors.destinationInventoryId = "L'inventaire de Destination requise lorsque Type de Mouvement est Transfert Entrant et Transfert Sortrant.";
            }
        }
    
        return errors;
    };


    const Submit = async (e) => {
        e.preventDefault();
        try {

            const timeValidationErrors = validateCategoryForm(formData);

            // If there are any time-related validation errors
            if (Object.keys(timeValidationErrors).length > 0) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...timeValidationErrors
                }));
                return;
            }
            formData.quantity = parseFloat(formData.quantity);
            InventoriesMovements.parse(formData);
            console.log(formData)
            const token = Cookies.get('access_token');
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/inventories-movements`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                inventoryId: id,
                destinationInventoryId: null,
                quantity: null,
                movementDate: null,
                notes:null,
                reason:null,
            });
            setErrors({});
            toast.success('Mouvement Inventaire créé avec succès!', {
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
            const errorMessage = error.response?.data?.message || error.message;
            console.error('Error creating Inventories Movements:', errorMessage);
            toast.error(errorMessage, {
            icon: '❌',
            position: "top-right",
            autoClose: 3000,
            });
        }
        }
    };
    const movementTypes = [
        { value: 'allocation_product', label: 'Affectation de Produit' },
        { value: 'wastage', label: 'Perte' },
        { value: 'customer_return', label: 'Retour Client' },
        { value: 'supplier_return', label: 'Retour Fournisseur' },
        { value: 'transfer_in', label: 'Transfert Entrant' },
        { value: 'transfer_out', label: 'Transfert Sortant' },
        { value: 'sale', label: 'Vente' },
        { value: 'adjustment_increase', label: 'Ajustement (Augmentation)' },
        { value: 'adjustment_decrease', label: 'Ajustement (Diminution)' },
        { value: 'inventory_count_increase', label: 'Comptage d\'Inventaire (Augmentation)' },
        { value: 'inventory_count_decrease', label: 'Comptage d\'Inventaire (Diminution)' },
        { value: 'inventory_initial', label: 'Initialisation de l\'Inventaire' },
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
                                <SelectContent className="max-h-48 overflow-y-auto">
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
                            <Label htmlFor="destinationInventoryId">Inventaire de Destination</Label>
                            <Select
                                id="destinationInventoryId"
                                name="destinationInventoryId"
                                value={formData.destinationInventoryId || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'destinationInventoryId', value } })}
                                disabled={
                                    formData.movementType !== 'transfer_in' && 
                                    formData.movementType !== 'transfer_out'
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un inventaire" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {inventorys.length > 0 ? (
                                        inventorys
                                            .map((inventory) => (
                                                <SelectItem key={inventory.id} value={inventory.id}>
                                                    {inventory.sku}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {/* <p className="text-xs text-gray-600 mt-0">
                                Veuillez sélectionner l'inventaire de destination pour les transferts entrants ou sortants.
                            </p> */}
                            {errors.destinationInventoryId && (
                                <p className="text-xs text-red-500 mt-1">{errors.destinationInventoryId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantité <span className='text-red-500 text-base'>*</span></Label>
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
                            <Label htmlFor="storageId">Date</Label>
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
