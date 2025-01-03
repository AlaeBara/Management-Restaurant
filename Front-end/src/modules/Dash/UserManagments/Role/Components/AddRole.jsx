import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Loader} from 'lucide-react'



// Zod schema for form validation
const roleSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères").max(20, "Le nom ne peut pas dépasser 20 caractères"),
  label: z.string().optional(),
});

export default function Component() {
    const navigate = useNavigate()
    const [alert, setAlert] = useState({ message: null, type: null });
    const [formData, setFormData] = useState({
        name: '',
        label: ''
    });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            roleSchema.parse(formData);

            const token = Cookies.get('access_token');
            setIsLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/roles`, formData, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                name: '',
                label: ''
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message ||  "Rôle créé avec succès !", {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/Gestion-des-roles`),
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
                console.error('Error creating role:', error.response?.data?.message || error.message);
                setAlert({
                    message: Array.isArray(error.response?.data?.message) 
                    ? error.response?.data?.message[0] 
                    : error.response?.data?.message || 'Erreur lors de la creation du rôle!',
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
            <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau rôle</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour ajouter un nouveau rôle au système.
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
                            <Label htmlFor="name">Nom de Rôle <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="name"
                                name="name"  // Fixed name attribute
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nom de rôle"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="label">Description </Label>
                            <textarea
                                id="label"
                                name="label"  // Fixed name attribute
                                value={formData.label}
                                onChange={handleChange}
                                placeholder="Description du rôle"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="3"
                            />
                            {errors.label && (
                                <p className="text-xs text-red-500 mt-1">{errors.label}</p>
                            )}
                        </div>

                        <div className='flex gap-4'>

                            <Button type="submit" onClick={()=>navigate('/dash/Gestion-des-roles')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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
