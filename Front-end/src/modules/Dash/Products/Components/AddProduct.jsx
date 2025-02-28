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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Loader} from 'lucide-react'

// Zod schema for form validation
const ProductAddSchema = z.object({
    productSKU: z
        .string()
        .max(15, "Le SKU du produit ne doit pas dépasser 15 caractères")
        .nonempty("Le SKU du produit est requis"),
  
    productName: z
        .string()
        .max(75, "Le nom du produit ne doit pas dépasser 75 caractères")
        .nonempty("Le nom du produit est requis"),
        
    productDescription: z
        .string().nullable()
        .optional(),

    isOffered: z.boolean().optional(),
    
    productType: z.string({
        required_error: "Le type de produit est requis.",
        }).min(1, "Le produit type ne peut pas être vide."),

});

export default function Component() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        productSKU: '',
        productName: '',
        productDescription: "",
        isOffered: true,
        productType: "",
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ message: null, type: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            ProductAddSchema.parse(formData);
            setIsLoading(true);
            const token = Cookies.get('access_token');
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                productSKU: '',
                productName: '',
                productDescription: "",
                isOffered: true,
                productType: ""
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message || 'Produit créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/Produits`),
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
            console.error('Error creating produits:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message[0] 
                : error.response?.data?.message || 'Erreur lors de la creation du Produit!',
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
            <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau Produit en Stock</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour ajouter un nouveau Produit au système.
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productSKU">SKU du produit <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="productSKU"
                                name="productSKU"
                                value={formData.productSKU}
                                onChange={handleChange}
                                placeholder="Exemple: DIND-001"
                            />
                            {errors.productSKU && (
                            <p className="text-xs text-red-500 mt-1">{errors.productSKU}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="productName">Nom du produit <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="Exemple: Dinde"
                            />
                            {errors.productName && (
                            <p className="text-xs text-red-500 mt-1">{errors.productName}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="label">Description du produit</Label>
                        <textarea
                            id="productDescription"
                            name="productDescription"
                            value={formData.productDescription || ""}
                            onChange={handleChange}
                            placeholder="Description du produit"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="3"
                        />
                        {errors.productDescription && (
                            <p className="text-xs text-red-500 mt-1">{errors.productDescription}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productType">Type de produit <span className='text-red-500 text-base'>*</span></Label>
                            <Select value={formData.productType} onValueChange={(value) => handleSelectChange('productType', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez Type de produit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ingredient">ingrédient</SelectItem>
                                    <SelectItem value="beverage">boisson</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.productType  && (
                            <p className="text-xs text-red-500 mt-1">{errors.productType}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="isOffered">Produit offert</Label>
                            <Select value={formData.isOffered} onValueChange={(value) => handleSelectChange('isOffered', value === 'true')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez l'État">
                                        {formData.isOffered ? 'Oui' : 'Non'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Oui</SelectItem>
                                    <SelectItem value="false">Non</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.isOffered&& (
                            <p className="text-xs text-red-500 mt-1">{errors.isOffered}</p>
                            )}
                        </div>
                    </div>



                    <div className="flex gap-4">
                        <Button type="button" onClick={() => navigate(`/dash/Produits`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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
        </div>
    </>
  );
}
