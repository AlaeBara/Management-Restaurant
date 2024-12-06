import React, { useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useFetchOneUnits} from '../Hooks/useFetchOneUnit'
import {useUpdateUnit} from "../Hooks/useUpdateUnit"
import Spinner from '@/components/Spinner/Spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



export default function Component() {
    const navigate = useNavigate()
    const {id} = useParams()

    const { formData, setFormData, initialData, setInitialData, message, loading } =useFetchOneUnits(id);
    const { errors, updateUnit  } = useUpdateUnit(id, formData, setFormData, initialData, setInitialData);

    const handleChange = useCallback((e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }, [formData, setFormData]);

    const units = [
        { value: "kg", label: "kilogramme" },
        { value: "g", label: "gramme" },
        { value: "mg", label: "milligramme" },
        { value: "lb", label: "livre" },
        { value: "oz", label: "once" },
        { value: "l", label: "litre" },
        { value: "ml", label: "millilitre" },
        { value: "gal", label: "gallon" },
        { value: "qt", label: "quart" },
        { value: "pt", label: "pinte" },
        { value: "cup", label: "tasse" },
        { value: "fl oz", label: "once liquide" },
        { value: "tbsp", label: "cuillère à soupe" },
        { value: "tsp", label: "cuillère à café" },
        { value: "pc", label: "pièce" },
        { value: "doz", label: "douzaine" },
        { value: "pack", label: "paquet" },
        { value: "box", label: "boîte" },
        { value: "case", label: "caisse" },
        { value: "in", label: "pouce" },
        { value: "cm", label: "centimètre" },
        { value: "bunch", label: "botte" },
        { value: "head", label: "tête" },
        { value: "slice", label: "tranche" },
        { value: "serving", label: "portion" },
        { value: "portion", label: "portion" }
    ];
    
    const baseUnits = [
        { value: "kg", label: "kilogramme" },
        { value: "g", label: "gramme" },
        { value: "l", label: "litre" },
        { value: "ml", label: "millilitre" }
    ];


    return (
        <>
            <ToastContainer />

            <div className="space-y-2 m-3">
                <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour l'Unité</h1>
                <p className="text-base text-gray-600">
                    Modifiez les informations ci-dessous pour mettre à jour l'Unité dans le système.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center my-10">
                    <Spinner title="Chargement des données, veuillez patienter..." />
                </div>
            ) : message ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Erreur</p>
                    <p className="break-words">{message}</p>
                </div>
            ) : (

            <div className="container p-0 max-w-2xl">
                <Card className="w-full border-none shadow-none">
                    <CardContent className="pt-6">
                        <form onSubmit={updateUnit} className="space-y-4">

                        <div className="space-y-2">
                                <Label htmlFor="name">Unité <span className='text-red-500 text-base'>*</span></Label>
                                <Select
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onValueChange={(value) => handleChange({ target: { name: 'unit', value } })}
                                >
                                    <SelectTrigger>
                                        {/* <SelectValue placeholder="Sélectionner une Unité" /> */}
                                        <SelectValue placeholder={
                                            units.find((unit) => unit.value === formData.unit)?.label ||
                                            'Sélectionner une Unité'
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.value} value={unit.value}>
                                        {unit.label}
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
                                        {/* <SelectValue placeholder="Sélectionner une Unité de base" /> */}
                                        <SelectValue placeholder={
                                            baseUnits.find((baseUnit) => baseUnit.value === formData.baseUnit)?.label ||
                                            'Sélectionner une Unité de base'
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {baseUnits.map((baseUnit) => (
                                        <SelectItem key={baseUnit.value} value={baseUnit.value}>
                                            {baseUnit.label}
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
                                    Retour
                                </Button>
                                <Button type="submit" className="w-full">
                                    Mettre à jour
                                </Button>

                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div >

        )}
        </>
    );
}