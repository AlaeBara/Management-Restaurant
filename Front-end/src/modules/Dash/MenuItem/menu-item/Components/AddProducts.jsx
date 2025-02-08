import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Plus , Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {useFetchTags} from '../../Tags/hooks/useFetchTags'
import {useFetchCategory} from '../../../Category/Hooks/useFetchCategory'
import {useFetchLangages} from '../hooks/useFetchLangages'
import {useFetchProduct} from '../../../Products/Hooks/useFetchProduct'
import {useFetchUnits} from '../../../Units/Hooks/useFetchUnits'
import {useFetchDiscounts} from '../../../MenuItem/Discount/Hooks/useFetchDiscounts'
import ReactSelect from 'react-select';
import {X} from 'lucide-react'
import {useFetchIventory} from '../../../Achats/Hooks/useFetchInventorys'
import { Textarea } from "@/components/ui/textarea";

    const fomulastemSchema = z.object({
        productId: z
            .string()
            .nullable()
            .optional(),

        inventoryId: z
            .string()
            .nullable()
            .optional(),

        ingredientQuantity:z.coerce
            .number({
                required_error: "Le Quantité dans la formule est obligatoire",
                invalid_type_error: "Le Quantité dans la formule doit être un nombre",
            })
            .nonnegative({ message: "Le Quantité dans la formule doit être un nombre positif" }).optional(),
            
        unitId:z
            .string()
            .nullable()
            .optional(),
    });


    const TranslateSchema = z.object({
            languageId: z.string().optional(), 
            name: z.string().optional(), 
            description: z.string().optional(), 
        }).superRefine((data, ctx) => {
            // If any field is provided, all fields become required
            if (data.languageId || data.name || data.description) {
            if (!data.languageId) {
                ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La langue est obligatoire si un autre champ est rempli",
                path: ["languageId"],
                });
            }
            if (!data.name) {
                ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Le nom du produit du menu est obligatoire si un autre champ est rempli",
                path: ["name"],
                });
            }
            if (!data.description) {
                ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La description du produit du menu est obligatoire si un autre champ est rempli",
                path: ["description"],
                });
            }
            }
        });


    const ProductSchema = z.object({
        //Formule
        recipe: z.array(fomulastemSchema).nullable().optional(),

        //Tag  
        tagIds: z
            .array(z.string())
            .min(1, "Au moins un tag est requis"),

        //Translate 
        translates: z.array(TranslateSchema).min(0),
        //Info
        menuItemSku: z
            .string()
            .nonempty({ message: "Sku de l'aricle est obligatoire" })
            .max(15, { message: "Le Sku de l'article ne doit pas dépasser 15 caractères" }),

        quantity:z.coerce
            .number({
                required_error: "Le Quantité  est obligatoire",
                invalid_type_error: "Le Quantité doit être un nombre",
            })
            .nonnegative({ message: "Le Quantité doit être un nombre positif" }).optional(),

        warningQuantity: z.coerce
            .number({
                required_error: "Le Quantité d'alerte est obligatoire",
                invalid_type_error: "Le Quantité d'alerte doit être un nombre",
            })
            .nonnegative({ message: "Le Quantité d'alerte doit être un nombre positif" }),

        isPublished: z.boolean().optional(),

        isDraft: z.boolean().optional(),

        hasRecipe: z.boolean().optional(),

        categoryId:  z
            .string()
            .nullable()
            .optional(),


        name: z
            .string()
            .nonempty({ message: "Le nom de l'article est obligatoire" }) 
            .min(3, { message: "Le nom de l'article doit contenir au moins 3 caractères" })
            .max(255, { message: "Le nom de l'article ne doit pas dépasser 255 caractères" }), 
        
        description: z
            .string()
            .nonempty({ message: "La description de l'article est obligatoire" }) 
            .min(3, { message: "La description de l'article doit contenir au moins 3 caractères" })
            .max(255, { message: "La description de l'article ne doit pas dépasser 255 caractères" }), 

        

        portionProduced:z.coerce
            .number({
                required_error: "Le Portion produite est obligatoire.",
                invalid_type_error: "Le Portion produite doit être un nombre",
            })
            .nonnegative({ message: "Le Portion produite doit être un nombre positif" }).optional(),

        basePrice: z.coerce
            .number({
                required_error: "Le prix de base est obligatoire",
                invalid_type_error: "Le prix de base doit être un nombre",
            })
            .nonnegative({ message: "Le prix doit être un nombre positif" }),

        discountId:z
            .string()
            .nullable()
            .optional(),

        discountMethod :z
            .string()
            .nullable()
            .optional(),

        discountValue: z.coerce
            .number({
                required_error: "Le valeur de remise est obligatoire",
                invalid_type_error: "Le valeur de remise doit être un nombre",
            })
            .nonnegative({ message: "Le valeur de remise doit être un nombre positif" }).optional(),

    });


export default function AchatCreationForm() {
    const navigate = useNavigate();

    const { tags, fetchTags } = useFetchTags()
    const { categories,  fetchCategorie} = useFetchCategory()
    const {langages, fetchLangage} =useFetchLangages()
    const { product, fetchProduct} = useFetchProduct()
    const { units , fetchUnits} = useFetchUnits()
    const { discounts,  fetchDiscounts } =useFetchDiscounts()
    const [alert, setAlert] = useState({ message: null, type: null });
    const [fileError, setFileError] = useState("");

    //api for get All inventaire of product
    const {inventorys, totalIventory, loading, error, fetchIventory}=useFetchIventory()

    useEffect(() => {
        fetchTags({fetchAll: true });
        fetchCategorie({fetchAll: true });
        fetchLangage({fetchAll: true });
        fetchProduct({fetchAll: true });
        fetchUnits({fetchAll: true })
        fetchDiscounts({fetchAll: true })
        fetchIventory({fetchAll: true })
    }, [fetchTags,fetchCategorie,fetchLangage,fetchProduct,fetchUnits,fetchIventory]);


    const [formData, setFormData] = useState({
        menuItemSku: '',
        quantity: '',
        name: '',
        description: '',
        warningQuantity: null,
        isPublished: false,
        isDraft: false,
        categoryId: '',
        hasRecipe: false,
        portionProduced:  null,
        recipe: [
            {
                productId: '',
                inventoryId:  '',
                ingredientQuantity: null,
                unitId: ''
            }
        ],
        tagIds: [],
        translates: [
            {
                languageId:'',
                name: '',
                description: ''
            }
        ],
        images: [] ,
        basePrice: null,
        discountId: '',
        discountLevel : 'no-discount',
        discountValue: null,
        discountMethod: ''
    });


    useEffect(() => {
        if (langages.length > 0) {
            const frenchLangId = langages.find(lang => lang.label === "Français")?.id || "";
            setFormData((prev) => ({
                ...prev,
                translates: [
                    {
                        ...prev.translates[0],
                        languageId: frenchLangId,
                    },
                ],
            }));
        }
    }, [langages]);
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [name]: value,
            };
        });
    };


    //for images 
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate file types
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        const invalidFiles = files.filter((file) => !validImageTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            setFileError("Seuls les fichiers image (JPEG, PNG, JPG) sont acceptés.");
            return;
        }

        setFileError("");

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
        }));
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };
    

    //forTags
    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };


    //for translates
    const handleChangee = (value, index, field) => {
        const updatedItems = [...formData.translates];
        
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };

        setFormData(prevFormData => ({
            ...prevFormData,
            translates: updatedItems
        }));
    };

    const handleChangee2 = (value, index, field) => {
        const numericFields = ['ingredientQuantity', 'portionProduced'];
    
        // Process the value based on the field type
        let processedValue;
        if (numericFields.includes(field)) {
            // Convert to number if the value is not empty, otherwise set to null
            processedValue = value === "" ? null : Number(value);
        } else {
            // For non-numeric fields, keep the value as-is
            processedValue = value;
        }
    
        // Update the specific formula in the formulas array
        const updatedItems = [...formData.recipe];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: processedValue
        };
    
        // Update the formData state
        setFormData(prevFormData => ({
            ...prevFormData,
            recipe: updatedItems
        }));
    };

    // Add Translate row
    const addTranslate = () => {
        setFormData({
            ...formData,
            translates: [...formData.translates, {
                languageId: '',
                name: '',
                description: '',
            }]
        });
    };

    // Remove Translate row
    const removeTranslate= (index) => {
        const newtranslates = formData.translates.filter((_, i) => i !== index);
        setFormData({ ...formData, translates: newtranslates });
    };

    // Add Formule row
    const addFormule = () => {
        setFormData({
            ...formData,
            recipe: [...formData.recipe, {
                productId: '',
                inventoryId: '',
                ingredientQuantity: null,
                unitId: ''
            }]
        });
    };

    // Remove Formule row
    const removeFormule= (index) => {
        const newFormulas = formData.recipe.filter((_, i) => i !== index);
        setFormData({ ...formData, recipe: newFormulas });
    };

    
    // Submit handler
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handler = async (e) => {
        e.preventDefault();

        try {
            // Parse numeric fields
            if (formData.basePrice) {
                formData.basePrice = parseFloat(formData.basePrice);
            }
            if (formData.discountValue) {
                formData.discountValue = parseFloat(formData.discountValue);
            }

            if(formData.quantity){
                formData.quantity = parseFloat(formData.quantity);
            }
            if(formData.warningQuantity){
                formData.warningQuantity = parseFloat(formData.warningQuantity);
            }
            if(formData.portionProduced){
                formData.portionProduced = parseFloat(formData.portionProduced);
            }
            

            // Custom validation price section
            let customErrors = {};
            if (formData.discountLevel === 'advanced') {
                if (!formData.discountId) {
                    customErrors.discountId = "Le nom de la réduction est obligatoire";
                }
            } else if (formData.discountLevel === 'basic') {
                if (!formData.discountMethod) {
                    customErrors.discountMethod = "Le type de remise est obligatoire";
                }
                if (formData.discountValue === null || formData.discountValue === '') {
                    customErrors.discountValue = "La valeur de remise est obligatoire";
                }
            }

            //Custom validation for warningQuantity
            if (formData.warningQuantity === null || formData.warningQuantity === undefined || formData.warningQuantity === "") {
                customErrors.warningQuantity = "Le Quantité d'alerte est obligatoire";
            } else if (formData.warningQuantity < 0) {
                customErrors.warningQuantity = "Le Quantité d'alerte doit être un nombre positif";
            }

            //Custom validation for warningQuantity
            if (formData.basePrice === null || formData.basePrice === undefined || formData.basePrice === "") {
                customErrors.basePrice = "Le Quantité d'alerte est obligatoire";
            } else if (formData.basePrice < 0) {
                customErrors.basePrice = "Le Quantité d'alerte doit être un nombre positif";
            }
    
            // Validate formulas if hasRecipe is true
            if (formData.hasRecipe) {
                if (!formData.recipe || formData.recipe.length === 0) {
                    customErrors.formulas = "Au moins une recette est requise";
                } else {
                    formData.recipe.forEach((formula, index) => {
                        if (!formula.productId) {
                            customErrors.recipe = customErrors.recipe || [];
                            customErrors.recipe[index] = customErrors.recipe[index] || {};
                            customErrors.recipe[index].productId = "L'ingrédient est obligatoire";
                        }
                        if (!formula.ingredientQuantity) {
                            customErrors.recipe = customErrors.recipe || [];
                            customErrors.recipe[index] = customErrors.recipe[index] || {};
                            customErrors.recipe[index].ingredientQuantity = "La quantité nécessaire est obligatoire";
                        }
                        if (!formula.unitId) {
                            customErrors.recipe = customErrors.recipe || [];
                            customErrors.recipe[index] = customErrors.recipe[index] || {};
                            customErrors.recipe[index].unitId = "L'unité est obligatoire";
                        }
                        if (!formula.inventoryId) {
                            customErrors.recipe = customErrors.recipe || [];
                            customErrors.recipe[index] = customErrors.recipe[index] || {};
                            customErrors.recipe[index].inventoryId = "L'inventaire est obligatoire";
                        }
                        if (!formData.portionProduced) {
                            customErrors.portionProduced = "Le Portion produite est obligatoire";
                        }
                    });
                }
            }

            if (!formData.hasRecipe) {
                if (!formData.quantity) {
                    customErrors.quantity = "Le Quantité  est obligatoire";
                }
            }

            // Validate the form data against the schema
            let schemaErrors = {};
            try {
                ProductSchema.parse(formData);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    schemaErrors = error.errors.reduce((acc, err) => {
                        const { path = [], message } = err;
    
                        if (path.length === 1) {
                            acc[path[0]] = message;
                        } else if (path[0] === 'recipe' || path[0] === 'translates') {
                            const [field, index, subfield] = path;
                            acc[field] = acc[field] || [];
                            acc[field][index] = acc[field][index] || {};
                            acc[field][index][subfield] = message;
                        } else if (path.length > 1) {
                            const [parentField, childField] = path;
                            acc[parentField] = acc[parentField] || {};
                            acc[parentField][childField] = message;
                        }
                        return acc;
                    }, {});
                }
            }
    
            // Merge custom errors and schema errors
            const allErrors = { ...customErrors, ...schemaErrors };
    
            if (Object.keys(allErrors).length > 0) {
                setErrors(allErrors);
                console.log(allErrors)
                const formattedMessages = Object.values(allErrors).flat().map(error => {
                    if (typeof error === 'object') {
                        return Object.values(error).join(' ; '); // Handle nested error objects
                    }
                    return error; 
                }).join(' ; ');
                setAlert({
                    message: formattedMessages,
                    type: "error",
                });
                return;
            }

            if (!formData.hasRecipe) {
                formData.recipe = [];
            }

            if (formData.hasRecipe) {
                formData.quantity= null;
            }

            if (formData.discountLevel === 'no-discount') {
                formData.discountMethod=null
                formData.discountValue=null
                formData.discountId=null
            }
    
            const preparedData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null && value !== "" && (!Array.isArray(value) || value.length !== 0))
            );

            console.log(preparedData)

            const formDataObject = new FormData();

            // Helper function to append fields if they exist and have a value
            const appendIfValid = (key, value) => {
                if (value !== null && value !== "") {
                    formDataObject.append(key, value);
                }
            };

            // Helper function to append nested objects
            const appendNestedObject = (prefix, obj) => {
                for (const key in obj) {
                    if (obj[key] !== null && obj[key] !== "") {
                        formDataObject.append(`${prefix}[${key}]`, obj[key]);
                    }
                }
            };

            // Helper function to append arrays
            const appendArray = (prefix, array) => {
                if (array && array.length > 0) {
                    array.forEach((item, index) => {
                        if (typeof item === 'object' && !(item instanceof File)) {
                            // Handle nested objects in arrays (e.g., formulas, translates)
                            for (const key in item) {
                                if (item[key] !== null && item[key] !== "") {
                                    formDataObject.append(`${prefix}[${index}][${key}]`, item[key]);
                                }
                            }
                        } else {
                            // Handle simple values or File objects
                            if (item !== null && item !== "") {
                                formDataObject.append(`${prefix}[${index}]`, item);
                            }
                        }
                    });
                }
            };


            // Step 2: Append fields to FormData
            appendIfValid('menuItemSku', preparedData.menuItemSku);
            appendIfValid('name', preparedData.name);
            appendIfValid('description', preparedData.description);
            if (!preparedData.hasRecipe) {
                appendIfValid('quantity', preparedData.quantity);
            }

            appendIfValid('warningQuantity', preparedData.warningQuantity);
            appendIfValid('isPublished', preparedData.isPublished);
            appendIfValid('isDraft', preparedData.isDraft);
            if(preparedData.categoryId){
                appendIfValid('categoryId', preparedData.categoryId);
            }
            appendIfValid('hasRecipe', preparedData.hasRecipe);

            appendIfValid('basePrice', preparedData.basePrice);

            if (preparedData.hasRecipe) {
                appendIfValid('portionProduced', preparedData.portionProduced);
                appendArray('recipe', preparedData.recipe);
            }

            // Append price fields
            if (preparedData.discountLevel === 'advanced') {
                appendIfValid('discountId', preparedData.discountId);
            }
            else if((preparedData.discountLevel === 'basic')) {
                appendIfValid('discountMethod', preparedData.discountMethod);
                appendIfValid('discountValue', preparedData.discountValue);
            }

            appendIfValid('discountLevel', preparedData.discountLevel);

            // Append translates array
            appendArray('translates', preparedData.translates);
            // Append tagIds array
            appendArray('tagIds', preparedData.tagIds);

            // Append images array
            if (formData.images?.length > 0) {
                formData.images.forEach(image => {
                    formDataObject.append('images', image);
                });
            }


            for (const [key, value] of formDataObject.entries()) {
                console.log(key, value);
            }

            setIsLoading(true);
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/menu-items`,  formDataObject, {
                headers: { Authorization: `Bearer ${token}` , 'Content-Type': 'multipart/form-data',},
            });
    
            // Reset form and errors
            setFormData({
                menuItemSku: '',
                quantity: '',
                name: '',
                description: '',
                warningQuantity: null,
                isPublished: false,
                isDraft: false,
                categoryId: '',
                hasRecipe: false,
                portionProduced:  null,

                recipe: [
                    {
                        productId: '',
                        inventoryId:  '',
                        ingredientQuantity: null,
                        unitId: ''
                    }
                ],
                tagIds: [],
                translates: [
                    {
                        languageId:'',
                        name: '',
                        description: ''
                    }
                ],
                images: [] ,
                basePrice: null,
                discountId: '',
                discountLevel : 'no-discount',
                discountValue: null,
                discountMethod: ''
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message || 'Produit créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/produits-menu`),
            });
            setIsLoading(false);
        } catch (error) {
            console.error('Error creating produit of menu:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message)
                    ? error.response?.data?.message[0]
                    : error.response?.data?.message || 'Erreur lors de la creation du Produit!',
                type: "error",
            });
            setIsLoading(false);
        }
    };


    const statuses = [
        { value: 'percentage', label: 'Pourcentage' },
        { value: 'fixed', label: 'Montant fixe' },
    ];

    const typeDiscounts = [
        { value: 'advanced', label: 'Avancé' },
        { value: 'basic', label: 'Basique' },
        { value: 'no-discount', label: 'Aucune remise' }
    ];

    return (
        <div className="w-full">

            <ToastContainer />
            <div className="space-y-2 p-4">
                <h1 className="text-2xl font-bold text-black font-sans">Ajouter Article de Menu</h1>
                <p className="text-base text-gray-600">
                    Remplissez les informations ci-dessous pour ajouter un nouvel article au menu. Assurez-vous de fournir tous les détails nécessaires pour une gestion efficace et une expérience client optimale.
                </p>
            </div>
    

            <div className="container p-0 w-full">
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

                        <form onSubmit={handler}  className="space-y-6">

                            <Tabs defaultValue="basic" className="w-full space-y-6">

                                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 h-max">
                                    <TabsTrigger value="basic" className="text-sm h-full py-2">Informations</TabsTrigger>
                                    <TabsTrigger value="translations" className="text-sm h-full py-2">Titre</TabsTrigger>
                                    <TabsTrigger value="price" className="text-sm h-full py-2">Prix</TabsTrigger>
                                    <TabsTrigger value="fermola" className="text-sm h-full py-2">Recette</TabsTrigger>
                                </TabsList>


                                <TabsContent value="basic" className="space-y-6 mt-5">

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                        <div className="space-y-2">
                                            <Label>Code l'article <span className='text-red-500 text-base'>*</span></Label>
                                            <Input
                                                name="menuItemSku"
                                                value={formData.menuItemSku}
                                                onChange={handleChange}
                                                placeholder="Exemple : PIZZA-MARG-001"
                                            />
                                            <p className="text-xs text-gray-600 mt-0">
                                                Veuillez saisir le code unique associé à cet article. Ce code est essentiel pour identifier et gérer l'article dans le système. Assurez-vous qu'il est exact et cohérent avec votre inventaire.
                                            </p>
                                            {errors.menuItemSku && (
                                                <p className="text-xs text-red-500 mt-1">{errors.menuItemSku}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Catégorie </Label>
                                            <Select
                                                name="categoryId"
                                                value={formData.categoryId || ""}
                                                onValueChange={(value) => handleChange({ target: { name: 'categoryId',  value } })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une Choix" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                {categories.length > 0 ? (
                                                    categories
                                                        .map((categorie) => (
                                                            <SelectItem key={categorie.id} value={categorie.id}>
                                                                {categorie.categoryName}
                                                            </SelectItem>
                                                        ))
                                                ) : (
                                                    <p className='text-sm'>Aucune donnée disponible</p>
                                                )}
                                                </SelectContent>
                                            </Select>
                                            
                                            {errors.categoryId && (
                                                <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Alerte de quantité faible  <span className='text-red-500 text-base'>*</span></Label>
                                            <Input
                                                type="number"
                                                name="warningQuantity"
                                                value={formData.warningQuantity !== null && formData.warningQuantity !== undefined ? formData.warningQuantity : ""}
                                                onChange={handleChange}
                                                placeholder='Exemple : 30 portions'
                                                min='0'
                                            />
                                            <p className="text-xs text-gray-600 mt-0">
                                                Veuillez saisir une description détaillée de l'article du menu. Cette description sera visible par les clients et doit inclure les ingrédients principaux, la préparation, et toute information pertinente pour aider à la décision d'achat.
                                            </p>
                                            {errors.warningQuantity && (
                                                <p className="text-xs text-red-500 mt-1">{errors.warningQuantity}</p>
                                            )}
                                        </div>
                
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        
                                        <div className="space-y-2">
                                            <Label>
                                                Nom de l'article <span className="text-red-500 text-base">*</span>
                                            </Label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Exemple : Pizza Margherita"
                                            />
                                            <p className="text-xs text-gray-600 mt-0">
                                                Veuillez saisir le nom de l'article du menu. Ce nom sera affiché aux clients dans le menu et utilisé pour l'identification dans le système de gestion du restaurant. Assurez-vous qu'il soit clair, précis et représentatif de l'article.
                                            </p>
                                            {errors.name && (
                                                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                            Description de l'article <span className="text-red-500 text-base">*</span>
                                            </Label>
                                            <Textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Exemple : Une délicieuse pizza garnie de fromage et de tomates"
                                            />
                                            <p className="text-xs text-gray-600 mt-0">
                                                Veuillez saisir une description détaillée de l'article du menu. Cette description sera affichée aux clients et doit inclure les ingrédients principaux, le mode de préparation et toute information pertinente pour les aider dans leur choix.
                                            </p>
                                            {errors.description && (
                                                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tag <span className='text-red-500 text-base'>*</span></Label>
                                        <ReactSelect
                                            id="activeDays"
                                            isMulti
                                            options={tags.map(tag => ({ value: tag.id, label: tag.tag }))}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={tags.filter((tag) => formData.tagIds.includes(tag.id)).map(tag => ({ value: tag.id, label: tag.tag }))}
                                            onChange={(selectedOptions) =>
                                            handleSelectChange(
                                                'tagIds',
                                                selectedOptions.map((tag) => tag.value) 
                                            )
                                        }
                                            menuPlacement="top" 
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '38px', 
                                                    height: 'auto',   
                                                    overflow: 'hidden', 
                                                }),
                                                valueContainer: (base) => ({
                                                    ...base,
                                                    maxHeight: '38px', 
                                                    overflowY: 'auto', 
                                                    display: 'flex',
                                                    flexWrap: 'wrap',  
                                                    paddingRight: '30px', 
                                                    '::-webkit-scrollbar': {
                                                        height: '4px', 
                                                    },
                                                    '::-webkit-scrollbar-track': {
                                                        background: '#f1f1f1', 
                                                        borderRadius: '2px',
                                                    },
                                                    '::-webkit-scrollbar-thumb': {
                                                        background: '#888', 
                                                        borderRadius: '2px',
                                                    },
                                                    '::-webkit-scrollbar-thumb:hover': {
                                                        background: '#555',
                                                    },
                                                    scrollbarWidth: 'thin',
                                                    scrollbarColor: '#888 #f1f1f1',
                                                }),
                                                multiValue: (base) => ({
                                                    ...base,
                                                
                                                    marginRight: '5px', 
                                                }),
                                                multiValueLabel: (base) => ({
                                                    ...base,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }),
                                                dropdownIndicator: (base) => ({
                                                    ...base,
                                                    padding: '0', 
                                                    color: 'black', 
                                                }),
                                                clearIndicator: (base) => ({
                                                    ...base,
                                                    padding: '0', 
                                                }),
                                            }}
                                        />
                                        <p className="text-xs text-gray-600 mt-0">
                                            Sélectionnez un ou plusieurs tags pour associer cet article à des catégories ou thèmes spécifiques. Ces tags aident à organiser et filtrer les articles. Par exemple, L'article "Pizza Margherita" peut être tagué <strong>"Italien"</strong> , <strong>"Végétarien"</strong>  et <strong>"Plat Principal"</strong> . Lorsqu'un client choisit un tag, tous les articles correspondants s'affichent dans le menu.
                                        </p>
                                        {errors.tagIds && (
                                            <p className="text-xs text-red-500 mt-1">{errors.tagIds}</p>
                                        )}

                                        {/* iMAGES */}

                                        <div className="space-y-4">
                                            <Label htmlFor="images">Images de l'article</Label>
                                            <div
                                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors"
                                            >
                                                <input
                                                    id="images"
                                                    name="images"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <label htmlFor="images" className="cursor-pointer">
                                                    <p className="text-gray-600">
                                                        Cliquez pour téléverser
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Vous pouvez sélectionner plusieurs images pour cet article. Les images doivent être au format JPEG, PNG ou JPG.
                                                    </p>
                                                </label>
                                            </div>
                                           
                                            {formData.images.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                                                    {formData.images.map((file, index) => (
                                                        <div key={index} className="relative w-24 h-24">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={`Preview ${index}`}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                                aria-label="Supprimer l'image"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Display file type error message */}
                                            {fileError && (
                                                <p className="text-xs text-red-500 mt-1">{fileError}</p>
                                            )}

                                            {/* Display error message */}
                                            {errors.images && (
                                                <p className="text-xs text-red-500 mt-1">{errors.images}</p>
                                            )}
                                        </div>


                                    </div>
                                    
                                </TabsContent>

                                <TabsContent value="fermola" className="space-y-4">

                                    <div className="space-y-4">

                                        <p className="text-ms mt-0">
                                            Ce formulaire vous permet de créer une <strong>recette de plat</strong> en spécifiant les <strong>ingrédients clés</strong> à suivre en stock (comme la dinde) et la <strong>portion produite</strong>. Les quantités d'ingrédients saisies ici seront automatiquement <strong>déduites du stock</strong> à chaque commande. Assurez-vous de remplir tous les champs nécessaires pour une <strong>gestion précise des stocks</strong>.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Type de suivi <span className='text-red-500 text-base'>*</span></Label>
                                                <Select
                                                    name="hasRecipe"
                                                    value={formData.hasRecipe === null ? "" : String(formData.hasRecipe)}
                                                    onValueChange={(value) => handleChange({ target: { name: 'hasRecipe',  value: value === 'true' } })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner une Choix" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">Suivi basé sur le stock</SelectItem>
                                                        <SelectItem value="false">Suivi basé sur la quantité</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-gray-600 mt-0">
                                                    Si "Type de suivi" est <strong>Suivi basé sur la quantité</strong>, la quantité du produit dans le menu sera directement liée à la quantité du produit en inventaire. Si <strong>Suivi basé sur le stock</strong>, la quantité sera déterminée par la <strong>Portion produite</strong>.
                                                </p>
                                                
                                                {errors.hasRecipe && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.hasRecipe}</p>
                                                )}
                                            </div>
                                        </div> 

                                        {!formData.hasRecipe ? 

                                        // grid grid-cols-1 sm:grid-cols-2 gap-4
                                        <div className="">
                                            <div className="space-y-2">
                                                <Label>Quantité <span className='text-red-500 text-base'>*</span></Label>
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    value={formData.quantity || ""}
                                                    onChange={handleChange}
                                                    placeholder='Exemple : 30 portions'
                                                    min="0"
                                                    disabled={formData.hasRecipe}
                                                />
                                                {errors.quantity && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                                                )}
                                            </div>
                                        </div>


                                        :

                                        <>

                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold lg:text-2xl md:text-xl sm:text-base">La Recette</h2>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={addFormule}
                                                className="flex items-center gap-2"
                                            >
                                                <Plus size={16} /> Ajouter Recette
                                            </Button>
                                            
                                        </div>

                                        <div className="grid gap-4">
                                            {formData.recipe.map((recipe, index) => (
                                                <div 
                                                    key={index} 
                                                    className="border p-4 rounded-lg"
                                                >

                                                    <div className="flex justify-end">
                                                        {formData.recipe.length > 1 && (
                                                            <Button 
                                                                type="button" 
                                                                variant="destructive" 
                                                                size="icon"
                                                                onClick={() => removeFormule(index)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'>
                                                        <div className="space-y-2">
                                                            <Label>Ingrédient <span className='text-red-500 text-base'>*</span></Label>
                                                            <Select
                                                                name="productId"
                                                                value={recipe.productId || ""}
                                                                onValueChange={(value) => handleChangee2(value, index, 'productId')}
                                                                disabled={!formData.hasRecipe}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionner une Ingrédient" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {product.length > 0 ? (
                                                                        product
                                                                            .map((product) => (
                                                                                <SelectItem key={product.id} value={product.id}>
                                                                                    {product.productName}
                                                                                </SelectItem>
                                                                            ))
                                                                    ) : (
                                                                        <p className='text-sm'>Aucune donnée disponible</p>
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            {errors.recipe && errors.recipe[index] && errors.recipe[index].productId && (
                                                                <p className="text-xs text-red-500 mt-1">
                                                                    {errors.recipe[index].productId}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Quantité <span className='text-red-500 text-base'>*</span></Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="number"
                                                                    name="ingredientQuantity"
                                                                    value={recipe.ingredientQuantity !== null && recipe.ingredientQuantity !== undefined ? recipe.ingredientQuantity : ""}
                                                                    onChange={(e) => handleChangee2(e.target.value, index, 'ingredientQuantity')}
                                                                    placeholder='Quantité nécessaire'
                                                                    disabled={!formData.hasRecipe}
                                                                    step='any'
                                                                    min="0"
                                                                    className="flex-1"
                                                                />
                                                                
                                                                <Select
                                                                    name="unitId"
                                                                    value={recipe.unitId || ""}
                                                                    onValueChange={(value) => handleChangee2(value, index, 'unitId')}
                                                                    disabled={!formData.hasRecipe}
                                                                >
                                                                    <SelectTrigger
                                                                        className={`w-[100px] ${
                                                                            !recipe.unitId && errors.recipe?.[index]?.unitId
                                                                                ? " border-solid border-2 border-red-500"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        <SelectValue placeholder="Unité" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {units.length > 0 ? (
                                                                            units.map((unit) => (
                                                                                <SelectItem key={unit.id} value={unit.id}>
                                                                                    {unit.unit}
                                                                                </SelectItem>
                                                                            ))
                                                                        ) : (
                                                                            <p className='text-sm'>Aucune donnée disponible</p>
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            {errors.recipe && errors.recipe[index] && errors.recipe[index].ingredientQuantity && (
                                                                <p className="text-xs text-red-500 mt-1">
                                                                    {errors.recipe[index].ingredientQuantity}
                                                                </p>
                                                            )}
                                                            {errors.recipe && errors.recipe[index] && errors.recipe[index].unitId && (
                                                                <p className="text-xs text-red-500 mt-1">
                                                                    {errors.recipe[index].unitId}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Inventaire <span className='text-red-500 text-base'>*</span></Label>
                                                            <Select
                                                                name="inventoryId"
                                                                value={recipe.inventoryId || ""}
                                                                onValueChange={(value) => handleChangee2(value, index, 'inventoryId')}
                                                                disabled={!recipe.productId}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionner un inventaire" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {inventorys.length > 0 ? (
                                                                        inventorys
                                                                            .filter((inventory) => inventory.productId === recipe.productId)
                                                                            .map((inventory) => (
                                                                                <SelectItem key={inventory.id} value={inventory.id}>
                                                                                    {inventory.sku} 
                                                                                </SelectItem>
                                                                            )).length > 0 ? (
                                                                                inventorys
                                                                                    .filter((inventory) => inventory.productId === recipe.productId)
                                                                                    .map((inventory) => (
                                                                                        <SelectItem key={inventory.id} value={inventory.id}>
                                                                                            {inventory.sku} 
                                                                                        </SelectItem>
                                                                                    ))
                                                                            ) : (
                                                                                <p className='text-sm'>Aucune donnée disponible</p>
                                                                            )
                                                                    ) : (
                                                                        <p className='text-sm'>Aucune donnée disponible</p>
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            {errors.recipe && errors.recipe[index] && errors.recipe[index].inventoryId && (
                                                                <p className="text-xs text-red-500 mt-1">
                                                                    {errors.recipe[index].inventoryId}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            ))}
                                        </div>

                                        <div className='flex justify-end'>
                                            <div className="space-y-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/3">
                                                <Label>Portion produite <span className='text-red-500 text-base'>*</span></Label>
                                                <Input
                                                    type="number"
                                                    name="portionProduced"
                                                    value={formData.portionProduced || ""}
                                                    onChange={handleChange}
                                                    placeholder='Exemple : 30 portions'
                                                    disabled={!formData.hasRecipe}
                                                    min="0"
                                                />
                                                {errors.portionProduced && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {errors.portionProduced}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        </>}

                                        
                                    </div>
                                </TabsContent>






                                <TabsContent value="price" className="space-y-4">

                                    <p className="text-ms mt-0">
                                        Définissez le <strong>prix de base</strong> de l'article et appliquez une <strong>réduction</strong> si nécessaire. Le prix de base est obligatoire, tandis que la réduction est facultative. Assurez-vous que le prix est cohérent avec votre stratégie tarifaire.
                                    </p>


                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Prix <span className='text-red-500 text-base'>*</span></Label>
                                            <Input
                                                type="number"
                                                name="basePrice"
                                                value={formData.basePrice !== null && formData.basePrice !== undefined ? formData.basePrice : ""}
                                                onChange={handleChange}
                                                placeholder="Prix (ex: 100 DH)"
                                                min="0"
                                            />
                                            {errors.basePrice && (
                                                <p className="text-xs text-red-500 mt-1">{errors.basePrice}</p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label>Catégorie de remise <span className='text-red-500 text-base'>*</span></Label>
                                            <Select
                                                name="discountLevel"
                                                value={formData.discountLevel || ""}
                                                onValueChange={(value) => handleChange({ target: { name: 'discountLevel',  value: value} })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une Choix" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeDiscounts.length > 0 ? (
                                                        typeDiscounts
                                                            .map((typeDiscounts) => (
                                                                <SelectItem key={typeDiscounts.value} value={typeDiscounts.value}>
                                                                    {typeDiscounts.label}
                                                                </SelectItem>
                                                            ))
                                                    ) : (
                                                        <p className='text-sm'>Aucune donnée disponible</p>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>                                        
                                    </div>


                                    {formData.discountLevel === 'basic' ? 


                                    (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Type de la remise  <span className='text-red-500 text-base'>*</span></Label>
                                            <Select
                                                id="discountMethod"
                                                name="discountMethod"
                                                value={formData.discountMethod  || ""}
                                                onValueChange={(value) => handleChange({ target: { name: 'discountMethod', value } })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez le type de remise" />
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
                                            {errors.discountMethod && (
                                                <p className="text-xs text-red-500 mt-1">{errors.discountMethod}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Valeur de la remise <span className='text-red-500 text-base'>*</span></Label>
                                            <Input
                                                type="number"
                                                name="discountValue"
                                                value={formData.discountValue !== null && formData.discountValue !== undefined ? formData.discountValue : ""}
                                                onChange={handleChange}
                                                placeholder='Exemple : 20'
                                                min="0"
                                                step="any"
                                                disabled={!formData.discountMethod}
                                                max={formData.discountMethod === 'percentage' ? '100' : undefined}
                                            />
                                            {errors.discountValue  && (
                                                <p className="text-xs text-red-500 mt-1">{errors.discountValue}</p>
                                            )}
                                        </div>
                                    </div>)

                                    : formData.discountLevel === 'advanced' ? (

                                    <div className="space-y-2">
                                        <Label>Nom de Réduction </Label>
                                        <Select
                                            name="discountId"
                                            value={formData.discountId}
                                            onValueChange={(value) => handleChange({ target: { name: 'discountId', value } })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner Réduction" />
                                            </SelectTrigger>
                                            <SelectContent  position="popper" 
                                                side="bottom" 
                                                align="start"
                                                className="max-h-[300px] overflow-y-auto"
                                            >
                                                <SelectItem value={null} className="font-semibold text-gray-400">
                                                    Aucune réduction
                                                </SelectItem>
                                                {discounts.length > 0 ? (
                                                    discounts
                                                        .map((discount) => (
                                                            <SelectItem key={discount.id} value={discount.id}>
                                                                {discount.discountSku} - {discount.discountValue} {discount.discountMethod === "percentage" ? '%' :"Dh" }
                                                            </SelectItem>
                                                        ))
                                                ) : (
                                                    <p className='text-sm'>Aucune donnée disponible</p>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.discountId && (
                                            <p className="text-xs text-red-500 mt-1">{errors.discountId}</p>
                                        )}
                                    </div>)
                                    : (
                                        null
                                    )}

                                    
                                </TabsContent>


                                <TabsContent value="translations" className="space-y-4">
                                    <div className="space-y-4">
                                        <p className="text-ms mt-0">
                                            Cette section vous permet de <strong> traduire le nom et la description de l'article </strong> dans différentes langues. Ces traductions seront <strong> affichées dans le menu </strong> en fonction de la langue choisie par le client. Assurez-vous de remplir les détails dans chaque langue pour offrir une <strong>expérience claire et agréable</strong> à vos clients.
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold lg:text-2xl md:text-xl sm:text-base">Les Titre</h2>
                                            {formData.translates.length === 3 ||
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={addTranslate}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Plus size={16} /> Ajouter Titre
                                                </Button>
                                            }
                                        </div>
                                        <div className="grid gap-4">
                                            
                                            {formData.translates.map((translates, index) => (
                                                <div  
                                                    key={index} 
                                                    className="border p-4 rounded-lg"
                                                >

                                                    <div className="flex justify-end">
                                                        {formData.translates.length > 1 && (
                                                            <Button 
                                                                type="button" 
                                                                variant="destructive" 
                                                                size="icon"
                                                                onClick={() => removeTranslate(index)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        )}
                                                    </div>
                                               
                                                <div 
                                                    key={index} 
                                                    className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4 rounded-lg"
                                                >
                                                    <div className="space-y-2">
                                                        <Label>Langue </Label>
                                                        <Select
                                                            name="languageId"
                                                            value={translates.languageId}
                                                            onValueChange={(value) => handleChangee(value, index, 'languageId')}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner une Choix" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                
                                                                {langages.length > 0 ? (
                                                                    langages
                                                                        .map((langage) => (
                                                                            <SelectItem key={langage.id} value={langage.id} disabled={formData.translates.some((t) => t.languageId === langage.id && t.languageId !== translates.languageId)}>
                                                                                {langage.label}
                                                                            </SelectItem>
                                                                        ))
                                                                ) : (
                                                                    <p className='text-sm'>Aucune donnée disponible</p>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.translates && errors.translates[index] && errors.translates[index].languageId && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {errors.translates[index].languageId}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Désignation de l'article </Label>
                                                        <Input
                                                            name="name"
                                                            value={translates.name || ""}
                                                            onChange={(e) => handleChangee(e.target.value, index, 'name')}
                                                            placeholder='Exemple : Pizza Margherita'
                                                        />
                                                    
                                                        {errors.translates && errors.translates[index] && errors.translates[index].name && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {errors.translates[index].name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Détails de plat</Label>
                                                        <Textarea
                                                            name="description"
                                                            value={translates.description || ""}
                                                            onChange={(e) => handleChangee(e.target.value, index, 'description')}
                                                            placeholder='Exemple : Une délicieuse pizza Margherita ...'
                                                        />
                                                        {errors.translates && errors.translates[index] && errors.translates[index].description && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {errors.translates[index].description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end w-full">
                                <div className="flex justify-end max-w-2xl gap-4">
                                    <Button type="button" onClick={() => navigate('/dash/produits-menu')} className="w-full bg-red-500  text-white hover:bg-red-600">
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]" onClick={() => {formData.isDraft = true ; formData.isPublished = false} }>
                                        {isLoading && formData.isDraft === true ? (
                                            <div className="flex items-center gap-2">
                                                <Loader className="h-4 w-4 animate-spin" />
                                                <span>Enregistrement en cours...</span>
                                            </div>
                                            ) : (
                                            "Brouillon"
                                        )}
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="w-full" onClick={() => {formData.isDraft = false ; formData.isPublished = true} }>
                                        {isLoading && formData.isDraft === false ? (
                                            <div className="flex items-center gap-2">
                                                <Loader className="h-4 w-4 animate-spin" />
                                                <span>Publication en cours...</span>
                                            </div>
                                            ) : (
                                            "Publié"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}