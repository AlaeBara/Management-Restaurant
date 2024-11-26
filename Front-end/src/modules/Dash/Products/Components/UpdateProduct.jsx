import React, { useState,useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useFetchUnits} from '../../Units/Hooks/useFetchUnits'
import {useFetchOneProduct} from '../Hooks/useFetchOneProduct'
import {useUpdateProduct} from '../Hooks/useUpdateProduct'
import Spinner from '@/components/Spinner/Spinner';


export default function Component() {

    const navigate = useNavigate();

    const {id} = useParams()

    const { formData, setFormData, initialData, setInitialData, message, loading } = useFetchOneProduct(id);
    const { errors, updateProduct} = useUpdateProduct(id, formData, setFormData, initialData, setInitialData);

    const { units, fetchUnits  } = useFetchUnits()

    useEffect(() => {
        fetchUnits({fetchAll: true});
    }, []);

   

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    
  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour le Produit</h1>
            <p className="text-base text-gray-600">
                Modifiez les informations ci-dessous pour mettre à jour le produit dans le système.
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
                    <form onSubmit={updateProduct} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productSKU">SKU du produit <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="productSKU"
                                name="productSKU"
                                value={formData.productSKU}
                                onChange={handleChange}
                                placeholder="SKU du produit"
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
                                placeholder="Nom du produit"
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
                            value={formData.productDescription}
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
                                        {formData.isOffered ? 'Actif' : 'Inactif'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Actif</SelectItem>
                                    <SelectItem value="false">Inactif</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.isOffered&& (
                            <p className="text-xs text-red-500 mt-1">{errors.isOffered}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unitId">Identifiant de l'unité</Label>
                        <Select
                            id="unitId"
                            name="unitId"
                            value={formData.unitId || ""}
                            onValueChange={(value) => handleChange({ target: { name: 'unitId', value } })}
                        >
                            <SelectTrigger>
                            <SelectValue
                                placeholder={
                                    units.find((unit) => unit.id === formData.unitId)?.baseUnit ||
                                    "Sélectionner la zone parent"
                                }
                            />
                            </SelectTrigger>
                            <SelectContent>
                                {units.length > 0 ? (
                                    units
                                        .map((unit) => (
                                            <SelectItem key={unit.id} value={unit.id}>
                                                {unit.unit} - {unit.baseUnit}
                                            </SelectItem>
                                        ))
                                ) : (
                                    <p>Aucune donnée disponible</p>
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-600 mt-0">
                            Sélectionnez une zone parent si cette zone doit être rattachée à une zone existante. Cette hiérarchisation permet d'organiser les zones de manière structurée.
                        </p>
                        {errors.parentZone && (
                            <p className="text-xs text-red-500 mt-1">{errors.parentZoneUUID}</p>
                        )}
                    </div>


                    <div className="flex gap-4">
                        <Button type="button" onClick={() => navigate(`/dash/Produits`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                           Retour
                        </Button>
                        <Button type="submit" className="w-full">
                            Mettre à jour
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
