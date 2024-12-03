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


// Zod schema for form validation
const fundSchema = z.object({
    sku: z.string().min(1, { message: "Le SKU  est obligatoire." }),

    name: z.string().min(1, { message: "Le nom du fond de caisse  est obligatoire." }),
    
    type: z
        .string()
        .nonempty({ message: "Le type de la caisse ne peut pas être vide." }),

    isActive: z
        .boolean()
        .nullable()
        .optional(),

    description: z
        .string()
        .nullable().
        optional()
    
});

export default function Component() {
    const navigate = useNavigate()


    const TypeFunds = [
        { value: 'main', label: 'Principal' },
        { value: 'waiters', label: 'Serveurs' },
        { value: 'kitchen', label: 'Cuisine' },
        { value: 'bar', label: 'Bar' },
        { value: 'delivery', label: 'Livraison' },
        { value: 'online', label: 'En ligne' },
        { value: 'other', label: 'Autre' },
    ];
      

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        type: '',
        isActive : null,
        description: null
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const cleanedData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null && value !== "")
            );

            fundSchema.parse(formData);

            console.log(cleanedData)

            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/funds`,  cleanedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                sku: '',
                name: '',
                type: '',
                isActive : null,
                description: null
            });
            setErrors({});
            toast.success('Caisse créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate("/dash/caisses")
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.errors.reduce((acc, { path, message }) => {
                    acc[path[0]] = message;
                return acc;
                }, {});
                setErrors(fieldErrors);
            } else {
                console.error('Error creating fund:', error.response?.data?.message || error.message);
                toast.error(error.response?.data?.message[0] || error.response?.data?.message, {
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
                <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau Caisse</h1>
                <p className="text-base text-gray-600">
                    Remplissez les informations ci-dessous pour ajouter un nouveau Caisse au système.
                </p>
            </div>

            <div className="container p-0 max-w-2xl">
                <Card className="w-full border-none shadow-none">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU du Caisse <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="sku"
                                    name="sku" 
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="SKU du Caisse"
                                />
                                {errors.sku && (
                                    <p className="text-xs text-red-500 mt-1">{errors.sku}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nom du fond de caisse <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nom du fond de caisse"
                                   
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type de fond <span className='text-red-500 text-base'>*</span></Label>
                                <Select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onValueChange={(value) => handleChange({ target: { name: 'type', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner type de fond" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TypeFunds.map((fund) => (
                                            <SelectItem key={fund.value} value={fund.value}>
                                                {fund.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-xs text-red-500 mt-1">{errors.type}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unitId">Statut actif</Label>
                                <Select
                                    id="isActive"
                                    name="isActive"
                                    value={formData.isActive === null ? "" : String(formData.isActive)}
                                    onValueChange={(value) => handleChange({ target: { name: 'isActive', value: value === 'true' } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner statut actif" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Oui</SelectItem>
                                        <SelectItem value="false">Non</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.isActive && (
                                    <p className="text-xs text-red-500 mt-1">{errors.isActive}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categoryDescription">Description du fond de caisse</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    placeholder="Description du fond de caisse"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    rows="3"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                                )}
                            </div>


                       
                            <div className='flex gap-4'>

                                <Button type="submit" onClick={() => navigate('/dash/caisses')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                    Annuler
                                </Button>
                                <Button type="submit" className="w-full">
                                    Ajouter
                                </Button>

                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div >
        </>
    );
}