import React, { useState,useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/Spinner/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {useFetchOneDiscounts} from '../Hooks/useFetchOneDiscounts'
import {useUpdateDiscounts} from '../Hooks/useUpdateDiscounts'


export default function Component() {

    const navigate = useNavigate();

    const {id} =useParams()

    const { formData, setFormData, initialData, setInitialData , message , loading} =useFetchOneDiscounts(id)


    const statuses = [
        { value: 'percentage', label: 'Pourcentage' },
        { value: 'fixed', label: 'Montant fixe' },
    ];
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const { errors, updateDiscounts, alert} = useUpdateDiscounts(id, formData, setFormData, initialData, setInitialData);


  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour le code promo</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour mettre à jour le code promo dans le système.
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

                    <form onSubmit={updateDiscounts} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="discountSku">SKU de la réduction  <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="discountSku"
                                name="discountSku"
                                value={formData.discountSku || ''}
                                onChange={handleChange}
                                placeholder="SKU de la réduction"
                            />
                            {errors.discountSku && (
                                <p className="text-xs text-red-500 mt-1">{errors.discountSku}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="discountType">Type de réduction <span className='text-red-500 text-base'>*</span></Label>
                                <Select
                                    id="discountType"
                                    name="discountType"
                                    value={formData.discountType  || ""}
                                    onValueChange={(value) => handleChange({ target: { name: 'discountType', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez le type de réduction" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-48 overflow-y-auto">
                                        {statuses.length > 0 ? (
                                            statuses
                                                .map((statuse) => (
                                                    <SelectItem key={statuse.value} value={statuse.value}>
                                                        {statuse.label}
                                                    </SelectItem>
                                                ))
                                        ) : (
                                            <p className='text-sm'>Aucune donnée disponible</p>
                                        )}
                                    </SelectContent>
                                </Select>
                               
                                {errors.discountType && (
                                    <p className="text-xs text-red-500 mt-1">{errors.discountType}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reference">Valeur de la réduction <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    type='Number'
                                    id="discountValue"
                                    name="discountValue"
                                    value={formData.discountValue || ''}
                                    onChange={handleChange}
                                    placeholder="Valeur de la réduction"
                                    min="0"
                                    step="any"
                                    disabled={!formData.discountType}
                                    max={formData.discountType === 'percentage' ? '100' : undefined}
                                
                                />
                                {errors.discountValue && (
                                <p className="text-xs text-red-500 mt-1">{errors.discountValue}</p>
                                )}
                            </div>
                            
                        </div>


                        
                        <div className="space-y-2">
                            <Label htmlFor="isActive">Status</Label>
                            <Select
                                id="isActive"
                                name="isActive"
                                value={formData.isActive !== null ? (formData.isActive ? 'true' : 'false') : ''}
                                onValueChange={(value) => handleChange({ target: { name: 'isActive', value: value === 'true' } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le status" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    <SelectItem value="true">Actif</SelectItem>
                                    <SelectItem value="false">Inactif</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.isActive && (
                                <p className="text-xs text-red-500 mt-1">{errors.isActive}</p>
                            )}
                        </div>
                       
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDateTime">Date et heure de début </Label>
                                <input
                                    type="datetime-local"
                                    id="startDateTime"
                                    name="startDateTime"
                                    value={formData.startDateTime || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {errors.startDateTime && (
                                    <p className="text-xs text-red-500 mt-1">{errors.startDateTime}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startDateTime">Date et heure de fin</Label>
                                <input
                                    type="datetime-local"
                                    id="endDateTime"
                                    name="endDateTime"
                                    value={formData.endDateTime || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {errors.endDateTime && (
                                    <p className="text-xs text-red-500 mt-1">{errors.endDateTime}</p>
                                )}
                            </div>

                        </div>
                      
                        <div className="flex gap-4">
                            <Button type="button" onClick={() => navigate(`/dash/code-promo`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                Annuler
                            </Button>
                            <Button type="submit" className="w-full">
                                Mise à jour
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

        )}
    </>
  );
}
