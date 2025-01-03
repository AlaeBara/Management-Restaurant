import React, { useEffect, useState } from 'react';
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
import {useFetchProduct} from '../../../Products/Hooks/useFetchProduct'
import {useFetchStorages} from '../../../Suplier&Stockage/Stockage/Hooks/useFetchStorages'
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Loader} from 'lucide-react'


// Zod schema for form validation
const InventorySchema = z.object({
    sku: z.string().min(1, { message: "Le SKU  est obligatoire." }),
    
    warningQuantity: z.coerce.number({
        required_error: "La quantité d'alerte est obligatoire.",
        invalid_type_error: "La quantité d'alerte est obligatoire.",
    })
    .nonnegative({ message: "Le facteur de conversion doit être un nombre positif." }),

    storageId: z
        .string()
        .nonempty({ message: "L'emplacement de stockage est obligatoire." }),

    productId: z
        .string()
        .nonempty({ message: "Le Produit associé est obligatoire." }),
    
});

export default function Component() {
    const navigate = useNavigate()

    const [alert, setAlert] = useState({ message: null, type: null });

    const { product, fetchProduct  } = useFetchProduct()
    const { Storages, fetchStorage  } = useFetchStorages()
    useEffect(() => {
        fetchProduct({fetchAll: true});
        fetchStorage({fetchAll: true});
    }, []);


    const [formData, setFormData] = useState({
        sku: '',
        warningQuantity: null,
        storageId: '',
        productId : ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = InventorySchema.parse({
                ...formData,
                warningQuantity: parseFloat(formData.warningQuantity)
            });
        
            const token = Cookies.get('access_token');
            setIsLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/inventories`,  validatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                sku: '',
                warningQuantity: null,
                storageId: '',
                productId : ''
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message || 'Inventaire créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate("/dash/inventaires")
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
                console.error('Error creating inventory:', error.response?.data?.message || error.message);
                setAlert({
                    message: Array.isArray(error.response?.data?.message) 
                    ? error.response?.data?.message[0] 
                    : error.response?.data?.message || 'Erreur lors de la creation du inventaire!',
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
                <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau Inventaire</h1>
                <p className="text-base text-gray-600">
                    Remplissez les informations ci-dessous pour ajouter un nouveau Inventaire au système.
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
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU du Inventaire <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="sku"
                                    name="sku" 
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="SKU du Inventaire"
                                />
                                {errors.sku && (
                                    <p className="text-xs text-red-500 mt-1">{errors.sku}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="label">Quantité d'alerte <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="warningQuantity"
                                    name="warningQuantity"
                                    value={formData.warningQuantity || ""}
                                    onChange={handleChange}
                                    placeholder="Quantité d'alerte"
                                    type='Number'
                                   
                                />
                                {errors.warningQuantity && (
                                    <p className="text-xs text-red-500 mt-1">{errors.warningQuantity}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unitId">Emplacement de stockage <span className='text-red-500 text-base'>*</span></Label>
                                <Select
                                    id="storageId"
                                    name="storageId"
                                    value={formData.storageId || ""}
                                    onValueChange={(value) => handleChange({ target: { name: 'storageId', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner l'Emplacement de stockage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Storages.length > 0 ? (
                                            Storages
                                                .map((Storage) => (
                                                    <SelectItem key={Storage.id} value={Storage.id}>
                                                        {Storage.hierarchyPath}
                                                    </SelectItem>
                                                ))
                                        ) : (
                                            <p className='text-sm'>Aucune donnée disponible</p>
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-600 mt-0">
                                    Sélectionnez l'emplacement de stockage où cet inventaire sera géré.
                                </p>
                                {errors.storageId && (
                                    <p className="text-xs text-red-500 mt-1">{errors.storageId}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unitId">Produit associé <span className='text-red-500 text-base'>*</span></Label>
                                <Select
                                    id="productId"
                                    name="productId"
                                    value={formData.productId || ""}
                                    onValueChange={(value) => handleChange({ target: { name: 'productId', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner Produit associé" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {product.length > 0 ? (
                                            product
                                                .map((product) => (
                                                    <SelectItem key={product.id} value={product.id}>
                                                        {product.productName}
                                                    </SelectItem>
                                                ))
                                        ) : (
                                            <p className='text-sm'>Aucune donnée disponible</p>
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-600 mt-0">
                                    Sélectionnez le produit dont vous souhaitez gérer l'inventaire.
                                </p>
                                {errors.productId && (
                                    <p className="text-xs text-red-500 mt-1">{errors.productId}</p>
                                )}
                            </div>
                       
                            <div className='flex gap-4'>

                                <Button type="submit" onClick={() => navigate('/dash/inventaires')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                    Annuler
                                </Button>
                                <Button type="submit" className="w-full" disabled={isLoading}>
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
            </div >
        </>
    );
}