import React, { useState,useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useFetchCategory} from '../Hooks/useFetchCategory'
import {useFetchOneCategory} from '../Hooks/useFetchOneCategory'
import {useUpdateCategory} from '../Hooks/useUpdateCategory'
import ReactSelect from 'react-select';
import Spinner from '@/components/Spinner/Spinner'


export default function Component() {

    const navigate = useNavigate();
    const {id} = useParams()

    const { categories, fetchCategorie  } = useFetchCategory()
    useEffect(() => {
        fetchCategorie ({fetchAll: true});
    }, []);

    const { formData, setFormData, initialData, setInitialData, message, loading } = useFetchOneCategory(id);
    const { errors, updateCategory} = useUpdateCategory(id, formData, setFormData, initialData, setInitialData);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };
    const daysOptions = [
        { value: 'Monday', label: 'Lundi' },
        { value: 'Tuesday', label: 'Mardi' },
        { value: 'Wednesday', label: 'Mercredi' },
        { value: 'Thursday', label: 'Jeudi' },
        { value: 'Friday', label: 'Vendredi' },
        { value: 'Saturday', label: 'Samedi' },
        { value: 'Sunday', label: 'Dimanche' },
    ];
    

  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau Catégorie ​</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour ajouter un nouveau Catégorie ​​​ au système.
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
                    <form onSubmit={updateCategory} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="categoryName">Nom de la catégorie <span className="text-red-500 text-base">*</span></Label>
                            <Input
                                id="categoryName"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleChange}
                                placeholder="Nom de la catégorie"
                            />
                            {errors.categoryName && (
                                <p className="text-xs text-red-500 mt-1">{errors.categoryName}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categoryCode">Code de la catégorie <span className="text-red-500 text-base">*</span></Label>
                            <Input
                                id="categoryCode"
                                name="categoryCode"
                                value={formData.categoryCode}
                                onChange={handleChange}
                                placeholder="Code de la catégorie"
                            />
                            {errors.categoryCode && (
                                <p className="text-xs text-red-500 mt-1">{errors.categoryCode}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryDescription">Description de la catégorie</Label>
                        <textarea
                            id="categoryDescription"
                            name="categoryDescription"
                            value={formData.categoryDescription}
                            onChange={handleChange}
                            placeholder="Description de la catégorie"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="3"
                        />
                        {errors.categoryDescription && (
                            <p className="text-xs text-red-500 mt-1">{errors.categoryDescription}</p>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="parentCategoryId">Catégorie parente</Label>
                        <Select
                            id="parentCategoryId"
                            name="parentCategoryId"
                            value={formData.parentCategoryId}
                            onValueChange={(value) => handleChange({ target: { name: 'parentCategoryId', value } })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={
                                    categories.find((categorie) => categorie.id === formData.parentCategoryId)?.categoryName ||
                                    'Sélectionner une catégorie parent'
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length > 0 ? (
                                    categories
                                        .filter((category) => category.id !== id)
                                        .map((categorie) => (
                                            <SelectItem key={categorie.id} value={ categorie.id}>
                                                {categorie.categoryName}
                                            </SelectItem>
                                        ))
                                ) : (
                                    <p className='text-sm'>Aucune donnée disponible</p>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.parentCategoryId && (
                            <p className="text-xs text-red-500 mt-1">{errors.parentCategoryId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="isTimeRestricted">Restriction temporelle <span className="text-red-500 text-base">*</span></Label>
                        <Select value={formData.isTimeRestricted} onValueChange={(value) => handleSelectChange('isTimeRestricted', value === 'true')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez l'État">
                                    {formData.isTimeRestricted? 'Oui' : 'Non'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Oui</SelectItem>
                                <SelectItem value="false">Non</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.isTimeRestricted && (
                            <p className="text-xs text-red-500 mt-1">{errors.isTimeRestricted}</p>
                        )}
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="space-y-2">
                            <Label htmlFor="activeTimeStart">Heure de début de la restriction <span className="text-red-500 text-base">*</span></Label>
                            <Input
                                id="activeTimeStart"
                                name="activeTimeStart"
                                value={formData.activeTimeStart}
                                onChange={handleChange}
                                placeholder="Heure de début de la restriction"
                            />
                            {errors.activeTimeStart && (
                                <p className="text-xs text-red-500 mt-1">{errors.activeTimeStart}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="activeTimeEnd">Heure de fin de la restriction <span className="text-red-500 text-base">*</span></Label>
                            <Input
                                id="activeTimeEnd"
                                name="activeTimeEnd"
                                value={formData.activeTimeEnd}
                                onChange={handleChange}
                                placeholder="Heure de fin de la restriction"
                            />
                            {errors.activeTimeEnd && (
                                <p className="text-xs text-red-500 mt-1">{errors.activeTimeEnd}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="activeDays">Jours actifs</Label>
                        <ReactSelect
                            id="activeDays"
                            isMulti
                            options={daysOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={daysOptions.filter((day) => formData.activeDays.includes(day.value))}
                            onChange={(selectedOptions) =>
                            handleSelectChange(
                                'activeDays',
                                selectedOptions.map((option) => option.value)
                            )
                            }
                        />
                        {errors.activeDays && (
                            <p className="text-xs text-red-500 mt-1">{errors.activeDays}</p>
                        )}
                        {errors.activeDays && (
                            <p className="text-xs text-red-500 mt-1">{errors.activeDays}</p>
                        )}
                    </div>


                    <div className="flex gap-4">
                        <Button type="button" onClick={() => navigate(`/dash/categories-Produits`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                            Retour
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
