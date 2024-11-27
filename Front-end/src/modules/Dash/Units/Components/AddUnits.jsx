import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { nullable, z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Zod schema for form validation
const UnitsSchema = z.object({
    unit: z.string().nonempty({ message: "L'unité est obligatoire." }),
    baseUnit: z
        .string()
        .nullable()
        .optional(),
    conversionFactorToBaseUnit: z
        .number()
        .nullable()
        .optional(),
    
});


export default function Component() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        unit: '',
        baseUnit: null,
        conversionFactorToBaseUnit: null
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const units = [
        "kg", "g", "mg", "lb", "oz", "l", "ml", "gal", "qt", "pt", "cup", 
        "fl oz", "tbsp", "tsp", "pc", "doz", "pack", "box", "case", "in", 
        "cm", "bunch", "head", "slice", "serving", "portion"
    ];
    const baseUnits = ["kg", "g", "l", "ml"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (formData.conversionFactorToBaseUnit !== null && formData.conversionFactorToBaseUnit !== '') {
                formData.conversionFactorToBaseUnit = parseFloat(formData.conversionFactorToBaseUnit);
            } else {
                formData.conversionFactorToBaseUnit = null;
            }
            const validatedData = UnitsSchema.parse({
                ...formData,
            });
            
            console.log('Validated data being sent:', validatedData);
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/units`,  validatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                unit: '',
                baseUnit: '',
                conversionFactorToBaseUnit: null
            });
            setErrors({});
            toast.success('Unité créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate("/dash/Units")
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.errors.reduce((acc, { path, message }) => {
                    acc[path[0]] = message;
                    return acc;
                }, {});
                setErrors(fieldErrors);
            } else {
                console.error('Error creating Units:', error.response?.data?.message || error.message);
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
                <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau Unité</h1>
                <p className="text-base text-gray-600">
                    Remplissez les informations ci-dessous pour ajouter un nouveau Unité au système.
                </p>
            </div>

            <div className="container p-0 max-w-2xl">
                <Card className="w-full border-none shadow-none">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="name">Unité <span className='text-red-500 text-base'>*</span></Label>
                                <Select
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onValueChange={(value) => handleChange({ target: { name: 'unit', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une Unité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                        {unit}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                {errors.unit && (
                                    <p className="text-xs text-red-500 mt-1">{errors.unit}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="label">Unité de base</Label>
                                <Select
                                    id="baseUnit"
                                    name="baseUnit"
                                    value={formData.baseUnit || ""}
                                    onValueChange={(value) => handleChange({ target: { name: 'baseUnit', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une Unité de base" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {baseUnits.map((baseUnit) => (
                                        <SelectItem key={baseUnit} value={baseUnit}>
                                            {baseUnit}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                {errors.baseUnit && (
                                    <p className="text-xs text-red-500 mt-1">{errors.baseUnit}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="label">Facteur de conversion vers l'unité de base</Label>
                                <Input
                                    id="conversionFactorToBaseUnit"
                                    name="conversionFactorToBaseUnit"
                                    value={formData.conversionFactorToBaseUnit || ""}
                                    onChange={handleChange}
                                    placeholder="Facteur de conversion vers l'unité de base"
                                    type='Number'
                                    step="any"
                                    min="0"
                                  
                                   
                                />
                                {errors.conversionFactorToBaseUnit && (
                                    <p className="text-xs text-red-500 mt-1">{errors.conversionFactorToBaseUnit}</p>
                                )}
                            </div>
                       
                            <div className='flex gap-4'>

                                <Button type="submit" onClick={() => navigate('/dash/Units')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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