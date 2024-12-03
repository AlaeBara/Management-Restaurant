import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useFetchOneFund} from '../hooks/useFetchOneFunds'
import Spinner from '@/components/Spinner/Spinner'
import {useUpdateFund} from '../hooks/useFetchUpdate'

export default function Component() {
    const navigate = useNavigate()
    const {id}= useParams()

    const TypeFunds = [
        { value: 'main', label: 'Principal' },
        { value: 'waiters', label: 'Serveurs' },
        { value: 'kitchen', label: 'Cuisine' },
        { value: 'bar', label: 'Bar' },
        { value: 'delivery', label: 'Livraison' },
        { value: 'online', label: 'En ligne' },
        { value: 'other', label: 'Autre' },
    ];
      
    const { formData, setFormData, initialData, setInitialData , message , loading} = useFetchOneFund(id)
    const { errors, updateFund} = useUpdateFund(id, formData, setFormData, initialData, setInitialData);

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer />

            <div className="space-y-2 m-3">
                <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour la Caisse</h1>
                <p className="text-base text-gray-600">
                    Modifiez les informations ci-dessous pour mettre à jour la Caisse dans le système.
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
                        <form onSubmit={updateFund}  className="space-y-4">

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
                                    <SelectValue placeholder={
                                        TypeFunds.find((TypeFund) => TypeFund.value === formData.type)?.label ||
                                        'Sélectionner une catégorie parent'
                                    } />
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
                                    value={formData.isActive ? 'true' :'false'}
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