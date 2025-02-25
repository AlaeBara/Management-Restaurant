import React, { useState,useEffect ,useCallback} from 'react';
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
import {useFetchCategory} from '../Hooks/useFetchCategory'
import ReactSelect from 'react-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Loader} from 'lucide-react'


// Zod schema for form validation
const CategorieAddSchema = z.object({
    categoryName: z
        .string()
        .nonempty({ message: "Le nom de la catégorie ne peut pas être vide." })
        .max(50, { message: "Le nom de la catégorie ne peut pas dépasser 50 caractères." }),

    categoryCode: z
        .string()
        .nonempty({ message: "Le code de la catégorie ne peut pas être vide." })
        .max(15, { message: "Le code de la catégorie ne peut pas dépasser 15 caractères." }),

    categoryDescription: z.string().nullable().optional(),

    parentCategoryId: z
    .string()
    .nullable()
    .optional(),

    isTimeRestricted: z
        .boolean()
        .optional(),
      

    activeTimeStart: z
        .string()
        .optional()
        .nullable()
        .refine((val) => {
            if (val === null || val === undefined) return true;
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
        }, { message: "L'heure de début doit être au format HH:mm." }),


    activeTimeEnd: z
        .string()
        .optional()
        .nullable()
        .refine((val) => {
            if (val === null || val === undefined) return true;
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
        }, { message: "L'heure de début doit être au format HH:mm." }),


    activeDays: z
        .array(z.string())
        .optional()
        .refine(
            (days) => days.every((day) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)),
            {
                message: "Les jours actifs doivent être des jours de la semaine valides.",
            }
        )
});

export default function Component() {

    const navigate = useNavigate();
    const [alert, setAlert] = useState({ message: null, type: null });

    const { categories, fetchCategorie  } = useFetchCategory()
    useEffect(() => {
        fetchCategorie ({fetchAll: true});
    }, []);

    const [formData, setFormData] = useState({
        categoryName: '',
        categoryCode: '',
        categoryDescription: "",
        parentCategoryId: null,
        isTimeRestricted: false,
        activeTimeStart: null,
        activeTimeEnd: null,
        activeDays: [],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

   
    const resetTimeRestrictionFields = useCallback(() => {
        setFormData((prev) => ({
        ...prev,
        activeTimeStart: null,
        activeTimeEnd: null,
        activeDays: [],
        }));
    }, []);

    useEffect(() => {
        if (!formData.isTimeRestricted) {
        resetTimeRestrictionFields();
        }
    }, [formData.isTimeRestricted, resetTimeRestrictionFields]);

    const validateCategoryForm = (formData) => {
        const errors = {};
    
        // Validate time-related fields only when time restriction is enabled
        if (formData.isTimeRestricted) {
            // Validate start time
            if (!formData.activeTimeStart || formData.activeTimeStart.trim() === '') {
                errors.activeTimeStart = "L'heure de début est requise lorsque les restrictions temporelles sont activées.";
            } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.activeTimeStart)) {
                errors.activeTimeStart = "L'heure de début doit être au format HH:mm.";
            }
    
            // Validate end time
            if (!formData.activeTimeEnd || formData.activeTimeEnd.trim() === '') {
                errors.activeTimeEnd = "L'heure de fin est requise lorsque les restrictions temporelles sont activées.";
            } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.activeTimeEnd)) {
                errors.activeTimeEnd = "L'heure de fin doit être au format HH:mm.";
            }
    
            // Validate active days
            if (!formData.activeDays || formData.activeDays.length === 0) {
                errors.activeDays = "Les jours actifs sont requis lorsque les restrictions temporelles sont activées.";
            } else {
                const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                const invalidDays = formData.activeDays.filter(day => !validDays.includes(day));
                
                if (invalidDays.length > 0) {
                    errors.activeDays = "Les jours actifs doivent être des jours de la semaine valides.";
                }
            }
        }
    
        return errors;
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const timeValidationErrors = validateCategoryForm(formData);

            // If there are any time-related validation errors
            if (Object.keys(timeValidationErrors).length > 0) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...timeValidationErrors
                }));
                return;
            }

            CategorieAddSchema.parse(formData);

            setIsLoading(true);
            const token = Cookies.get('access_token');
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                categoryName: '',
                categoryCode: '',
                categoryDescription: null,
                parentCategoryId: null,
                isTimeRestricted: null,
                activeTimeStart:  null,
                activeTimeEnd: null,
                activeDays: [],
            });
            setErrors({});
            toast.success(response.data.message || 'Catégorie créée avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/categories-Produits`),
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
            console.error('Error creating category:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message[0] 
                : error.response?.data?.message || 'Erreur lors de la creation du Catégorie!',
                type: "error",
            });
            setIsLoading(false);
        }
        }
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
                            value={formData.categoryDescription || ""}
                            onChange={handleChange}
                            placeholder="Description de la catégorie"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="3"
                        />
                        {errors.categoryDescription && (
                            <p className="text-xs text-red-500 mt-1">{errors.categoryDescription}</p>
                        )}
                    </div>
                    
                    {/* <div className="space-y-2">
                        <Label htmlFor="parentCategoryId">Catégorie parente</Label>
                        <Select
                            id="parentCategoryId"
                            name="parentCategoryId"
                            value={formData.parentCategoryId || ""}
                            onValueChange={(value) => handleChange({ target: { name: 'parentCategoryId', value } })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie parente" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length > 0 ? (
                                     categories
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
                    </div> */}

                    <div className="space-y-2">
                        <Label htmlFor="isTimeRestricted">Restriction temporelle</Label>
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
                            <Label htmlFor="activeTimeStart">Heure de début de la restriction {formData.isTimeRestricted && <span className="text-red-500 text-base">*</span> }</Label>
                            <Input
                                id="activeTimeStart"
                                name="activeTimeStart"
                                value={formData.activeTimeStart || ""}
                                onChange={handleChange}
                                placeholder="Heure de début de la restriction"
                                disabled={!formData.isTimeRestricted}
                            />
                            {errors.activeTimeStart && (
                                <p className="text-xs text-red-500 mt-1">{errors.activeTimeStart}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="activeTimeEnd">Heure de fin de la restriction {formData.isTimeRestricted && <span className="text-red-500 text-base">*</span> }</Label>
                            <Input
                                id="activeTimeEnd"
                                name="activeTimeEnd"
                                value={formData.activeTimeEnd || ""}
                                onChange={handleChange}
                                placeholder="Heure de fin de la restriction"
                                disabled={!formData.isTimeRestricted}
                            />
                            {errors.activeTimeEnd && (
                                <p className="text-xs text-red-500 mt-1">{errors.activeTimeEnd}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="activeDays">Jours actifs {formData.isTimeRestricted && <span className="text-red-500 text-base">*</span> }</Label>
                        <ReactSelect
                            id="activeDays"
                            isDisabled={!formData.isTimeRestricted}
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
                            menuPlacement="top" 
                        />
                        {errors.activeDays && (
                            <p className="text-xs text-red-500 mt-1">{errors.activeDays}</p>
                        )}
                    </div>



                    


                    <div className="flex gap-4">
                        <Button type="button" onClick={() => navigate(`/dash/categories-Produits`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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
