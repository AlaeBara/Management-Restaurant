import React, { useEffect, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {useFetchStorages} from '../Hooks/useFetchStorages'


// Zod schema for form validation
const StorageSchema = z.object({
    storageCode: z.string({
        required_error: "Le code du stockage est requis.",
    }).min(1, "Le code du stockage ne peut pas être vide."),
    
    storageName: z.string({
        required_error: "Le nom du stockage est requis.",
    }).min(1, "Le nom du stockage ne peut pas être vide."),
    
    parentStorageId: z.string().nullable().optional(),
    
});


export default function Component() {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        storageCode: '',
        storageName: '',
        parentStorageId: null,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { Storages, fetchStorage } = useFetchStorages()

    useEffect(() => {
        fetchStorage({ fetchAll: true });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            StorageSchema.parse(formData);
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/storages`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData({
                storageCode: '',
                storageName: '',
                parentStorageId: null,
            });
            setErrors({});

            toast.success('Stock créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate("/dash/Storage")
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
                console.error('Error creating storage:', errorMessage);
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
                <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau Stock</h1>
                <p className="text-base text-gray-600">
                    Remplissez les informations ci-dessous pour ajouter un nouveau Stock au système.
                </p>
            </div>

            <div className="container p-0 max-w-2xl">
                <Card className="w-full border-none shadow-none">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="storageCode">Code de stockage <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="storageCode"
                                    name="storageCode"
                                    value={formData.storageCode}
                                    onChange={handleChange}
                                    placeholder="Code de stockage"
                                />
                                {errors.storageCode && (
                                    <p className="text-xs text-red-500 mt-1">{errors.storageCode}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storageName">Nom du stockage <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="storageName"
                                    name="storageName"
                                    value={formData.storageName }
                                    onChange={handleChange}
                                    placeholder="Nom du stockage"
                                />
                                {errors.storageName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.storageName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parentZone">Hiérarchie</Label>
                                <Select
                                    id="parentStorageId"
                                    name="parentStorageId"
                                    value={formData.parentStorageId|| undefined}
                                    onValueChange={(value) => handleChange({ target: { name: 'parentStorageId', value } })}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner Hiérarchie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Storages.length > 0 ? (
                                        Storages.map((Storage) => (
                                            <SelectItem key={Storage.id} value={Storage.id}>
                                                {Storage.hierarchyPath}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 px-4">Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                                <p className="text-xs text-gray-600 mt-0">
                                    Sélectionnez un stockage parent si ce stockage doit être rattaché à un stockage existant. Cette hiérarchisation permet d'organiser les stockages de manière structurée.
                                </p>
                                {errors.parentStorageId && (
                                    <p className="text-xs text-red-500 mt-1">{errors.parentStorageId}</p>
                                )}
                            </div>

                            <div className='flex gap-4'>

                                <Button type="submit" onClick={() => navigate('/dash/Storage')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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