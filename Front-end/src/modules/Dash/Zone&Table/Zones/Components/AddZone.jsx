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
import { useFetchZone } from "../Hooks/useFetchZone"

// Zod schema for form validation
const zoneSchema = z.object({
    zoneLabel: z.string()
        .min(1, "Le label de la zone ne peut pas être vide")
        .max(50, "Le label de la zone ne peut pas dépasser 50 caractères"),
    zoneCode: z.string()
        .min(1, "Le code de la zone ne peut pas être vide")
        .max(50, "Le code de la zone ne peut pas dépasser 50 caractères"),
    parentZone: z.string().optional()
});


export default function Component() {


    const { zones, fetchZones } = useFetchZone()

    useEffect(() => {
        fetchZones();
    }, []);

    console.log("zones", zones)

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        zoneLabel: '',
        zoneCode: '',
        parentZoneUUID: null
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            zoneSchema.parse(formData);
            console.log('Data being sent:', formData);
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/zones`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData({
                zoneLabel: '',
                zoneCode: '',
                parentZoneUUID: null
            });
            setErrors({});

            toast.success('Zone créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate("/dash/zones")
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
                console.error('Error creating zone:', errorMessage);
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
                <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau Zone</h1>
                <p className="text-base text-gray-600">
                    Remplissez les informations ci-dessous pour ajouter un nouveau Zone au système.
                </p>
            </div>

            <div className="container p-0 max-w-2xl">
                <Card className="w-full border-none shadow-none">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Label de la Zone <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="zoneLabel"
                                    name="zoneLabel"  // Fixed name attribute
                                    value={formData.zoneLabel}
                                    onChange={handleChange}
                                    placeholder="Label de la Zone"
                                />
                                {errors.zoneLabel && (
                                    <p className="text-xs text-red-500 mt-1">{errors.zoneLabel}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="label">Code de la Zone <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="zoneCode"
                                    name="zoneCode"
                                    value={formData.zoneCode}
                                    onChange={handleChange}
                                    placeholder="Code de la Zone"
                                />
                                {errors.zoneCode && (
                                    <p className="text-xs text-red-500 mt-1">{errors.zoneCode}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parentZone">Zone Parent</Label>
                                <Select
                                    id="parentZone"
                                    name="parentZone"
                                    value={formData.parentZone}
                                    onValueChange={(value) => handleChange({ target: { name: 'parentZoneUUID', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner la zone parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zones.map((zone) => (
                                            <SelectItem key={zone.id} value={zone.id}>
                                                {zone.zoneLabel}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-600 mt-0">
                                    Sélectionnez une zone parent si cette zone doit être rattachée à une zone existante. Cette hiérarchisation permet d'organiser les zones de manière structurée.
                                </p>
                                {errors.parentZone && (
                                    <p className="text-xs text-red-500 mt-1">{errors.parentZoneUUID}</p>
                                )}
                            </div>

                            <div className='flex gap-4'>

                                <Button type="submit" onClick={() => navigate('/dash/zones')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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