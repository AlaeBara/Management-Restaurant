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

    const fomulastemSchema = z.object({
        productId: z
            .string()
            .nullable()
            .optional(),

        inventoryId:  z
            .string()
            .nullable()
            .optional(),

        quantityFormula:z.coerce
            .number({
                required_error: "Le Quantité dans la formule est obligatoire.",
                invalid_type_error: "Le Quantité dans la formule doit être un nombre.",
            })
            .nonnegative({ message: "Le Quantité dans la formule doit être un nombre positif." }).optional(),
        unitId:z
            .string()
            .nullable()
            .optional(),

    });


    const TranslateSchema = z.object({
        languageId: z
            .string()
            .nonempty({ message: "La langue est obligatoire." }),

        name: z
            .string()
            .nonempty({ message: "Nom du produit du menu est obligatoire." }),

        description: z
            .string()
            .nonempty({ message: "Description du produit du menu est obligatoire." }),
    })


    const ProductSchema = z.object({
        //Formule
        formulas: z.array(fomulastemSchema).nullable().optional(),

        //Tag  
        tagIds: z
            .array(z.string())
            .min(1, "Au moins un tag est requis"),

        //Translate 
        translates: z.array(TranslateSchema).min(1, { 
            message: "Au moins un produit est requis" 
        }),

        //Info
        menuItemSku: z
            .string()
            .nonempty({ message: "Sku de l'aricle est obligatoire." })
            .max(15, { message: "Le Sku de l'article ne doit pas dépasser 15 caractères." }),

        quantity:z.coerce
            .number({
                required_error: "Le Quantité  est obligatoire.",
                invalid_type_error: "Le Quantité doit être un nombre.",
            })
            .nonnegative({ message: "Le Quantité doit être un nombre positif." }).optional(),

        warningQuantity: z.coerce
            .number({
                required_error: "Le Quantité d'alerte est obligatoire.",
                invalid_type_error: "Le Quantité d'alerte doit être un nombre.",
            })
            .nonnegative({ message: "Le Quantité d'alerte doit être un nombre positif." }),

        isPublished: z.boolean().optional(),

        isDraft: z.boolean().optional(),

        hasFormulas: z.boolean().optional(),

        categoryId:  z
            .string()
            .nonempty({ message: "La Catégorie est obligatoire." }),


        portionProduced:z.coerce
            .number({
                required_error: "Le Portion produite est obligatoire.",
                invalid_type_error: "Le Portion produite doit être un nombre.",
            })
            .nonnegative({ message: "Le Portion produite doit être un nombre positif." }).optional(),

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
        warningQuantity: null,
        isPublished: false,
        isDraft: false,
        categoryId: '',
        hasFormulas: false,
        portionProduced:  null,
        formulas: [
            {
                productId: '',
                inventoryId:  '',
                quantityFormula: null,
                unitId: ''
            }
        ],
        tagIds: [],
        translates: [
            {
                languageId: '',
                name: '',
                description: ''
            }
        ],
        price: {
            basePrice: null,
            discountId: ''
        },
        images: [] 
    });
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prevFormData) => {
            if (name === "basePrice" || name === "discountId") {
                return {
                    ...prevFormData,
                    price: {
                        ...prevFormData.price,
                        [name]: value,
                    },
                };
            }
    
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
        const numericFields = ['quantityFormula', 'portionProduced'];
    
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
        const updatedItems = [...formData.formulas];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: processedValue
        };
    
        // Update the formData state
        setFormData(prevFormData => ({
            ...prevFormData,
            formulas: updatedItems
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
            formulas: [...formData.formulas, {
                productId: '',
                inventoryId: '',
                quantityFormula: null,
                unitId: ''
            }]
        });
    };

    // Remove Formule row
    const removeFormule= (index) => {
        const newFormulas = formData.formulas.filter((_, i) => i !== index);
        setFormData({ ...formData, formulas: newFormulas });
    };


    // Submit handler
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handler = async (e) => {
        e.preventDefault();

        try {
            // Parse numeric fields
            if (formData.price.basePrice) {
                formData.price.basePrice = parseFloat(formData.price.basePrice);
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
            

            // Custom validation for price.basePrice
            let customErrors = {};
            if (!formData.price.basePrice) {
                customErrors.price = customErrors.price || {};
                customErrors.price.basePrice = "Le prix de base est obligatoire.";
            } else if (formData.price.basePrice < 0) {
                customErrors.price = customErrors.price || {};
                customErrors.price.basePrice = "Le prix doit être un nombre positif.";
            }

            //Custom validation for warningQuantity
            if (formData.warningQuantity === null || formData.warningQuantity === undefined || formData.warningQuantity === "") {
                customErrors.warningQuantity = "Le Quantité d'alerte est obligatoire.";
            } else if (formData.warningQuantity < 0) {
                customErrors.warningQuantity = "Le Quantité d'alerte doit être un nombre positif.";
            }
    
            // Validate formulas if hasFormulas is true
            if (formData.hasFormulas) {
                if (!formData.formulas || formData.formulas.length === 0) {
                    customErrors.formulas = "Au moins une recette est requise.";
                } else {
                    formData.formulas.forEach((formula, index) => {
                        if (!formula.productId) {
                            customErrors.formulas = customErrors.formulas || [];
                            customErrors.formulas[index] = customErrors.formulas[index] || {};
                            customErrors.formulas[index].productId = "L'ingrédient est obligatoire.";
                        }
                        if (!formula.quantityFormula) {
                            customErrors.formulas = customErrors.formulas || [];
                            customErrors.formulas[index] = customErrors.formulas[index] || {};
                            customErrors.formulas[index].quantityFormula = "La quantité nécessaire est obligatoire.";
                        }
                        if (!formula.unitId) {
                            customErrors.formulas = customErrors.formulas || [];
                            customErrors.formulas[index] = customErrors.formulas[index] || {};
                            customErrors.formulas[index].unitId = "L'unité est obligatoire.";
                        }
                        if (!formData.portionProduced) {
                            customErrors.portionProduced = "Le Portion produite est obligatoire.";
                        }
                    });
                }
            }

            if (!formData.hasFormulas) {
                if (!formData.quantity) {
                    customErrors.quantity = "Le Quantité  est obligatoire.";
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
                        } else if (path[0] === 'formulas' || path[0] === 'translates') {
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
                return;
            }
            if (formData.price.discountId === "") {
                formData.price.discountId = null;
            }
            if (!formData.hasFormulas) {
                formData.formulas = [];
            }

            if (formData.hasFormulas) {
                formData.quantity= null;
            }
    
            const preparedData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null && value !== "" && (!Array.isArray(value) || value.length !== 0))
            );

            console.log(preparedData)

            // const formDataObject = new FormData();

            // // Append simple fields if they exist and have a value
            // if (preparedData.menuItemSku) formDataObject.append('menuItemSku', preparedData.menuItemSku);
            // if (preparedData.quantity !== null && preparedData.quantity !== "") formDataObject.append('quantity', preparedData.quantity);
            // if (preparedData.warningQuantity !== null && preparedData.warningQuantity !== "") formDataObject.append('warningQuantity', preparedData.warningQuantity);
            // if (preparedData.isPublished !== null && preparedData.isPublished !== "") formDataObject.append('isPublished', preparedData.isPublished);
            // if (preparedData.isDraft !== null && preparedData.isDraft !== "") formDataObject.append('isDraft', preparedData.isDraft);
            // if (preparedData.categoryId) formDataObject.append('categoryId', preparedData.categoryId);
            // if (preparedData.hasFormulas !== null && preparedData.hasFormulas !== "") formDataObject.append('hasFormulas', preparedData.hasFormulas);
            // if (preparedData.portionProduced !== null && preparedData.portionProduced !== "") formDataObject.append('portionProduced', preparedData.portionProduced);

            // // Append price fields if they exist and have a value
            // if (preparedData.price?.basePrice !== null && preparedData.price?.basePrice !== "") formDataObject.append('price[basePrice]', preparedData.price.basePrice);
            // if (preparedData.price?.discountId !== null && preparedData.price?.discountId !== "") formDataObject.append('price[discountId]', preparedData.price.discountId);

            // // Append formulas array if it exists and has items
            // if (preparedData.formulas && preparedData.formulas.length > 0) {
            //     preparedData.formulas.forEach((formula, index) => {
            //         if (formula.productId) formDataObject.append(`formulas[${index}][productId]`, formula.productId);
            //         if (formula.warningQuantity !== null && formula.warningQuantity !== "") formDataObject.append(`formulas[${index}][warningQuantity]`, formula.warningQuantity);
            //         if (formula.quantityFormula !== null && formula.quantityFormula !== "") formDataObject.append(`formulas[${index}][quantityFormula]`, formula.quantityFormula);
            //         if (formula.unitId) formDataObject.append(`formulas[${index}][unitId]`, formula.unitId);
            //     });
            // }

            // // Append translates array if it exists and has items
            // if (preparedData.translates && preparedData.translates.length > 0) {
            //     preparedData.translates.forEach((translate, index) => {
            //         if (translate.languageId) formDataObject.append(`translates[${index}][languageId]`, translate.languageId);
            //         if (translate.name) formDataObject.append(`translates[${index}][name]`, translate.name);
            //         if (translate.description) formDataObject.append(`translates[${index}][description]`, translate.description);
            //     });
            // }

            // // Append tagIds array if it exists and has items
            // if (preparedData.tagIds && preparedData.tagIds.length > 0) {
            //     preparedData.tagIds.forEach((tagId, index) => {
            //         if (tagId) formDataObject.append(`tagIds[${index}]`, tagId);
            //     });
            // }

            // // Append images array if it exists and has items
            // if (preparedData.images && preparedData.images.length > 0) {
            //     preparedData.images.forEach((image, index) => {
            //         if (image) formDataObject.append(`images[${index}]`, image);
            //     });
            // }

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
            if (!preparedData.hasFormulas) {
                appendIfValid('quantity', preparedData.quantity);
            }
            appendIfValid('warningQuantity', preparedData.warningQuantity);
            appendIfValid('isPublished', preparedData.isPublished);
            appendIfValid('isDraft', preparedData.isDraft);
            appendIfValid('categoryId', preparedData.categoryId);
            appendIfValid('hasFormulas', preparedData.hasFormulas);

            if (preparedData.hasFormulas) {
                appendIfValid('portionProduced', preparedData.portionProduced);
            }

            // Append price fields
            if (preparedData.price) {
                appendNestedObject('price', preparedData.price);
            }

            // Append formulas array
            appendArray('formulas', preparedData.formulas);

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
                warningQuantity: '',
                isPublished: false,
                isDraft: false,
                categoryId: '',
                hasFormulas: false,
                portionProduced: null,
                formulas: [
                    {
                        productId: '',
                        inventoryId: '',
                        quantityFormula: '',
                        unitId: ''
                    }
                ],
                tagIds: [],
                translates: [
                    {
                        languageId: '',
                        name: '',
                        description: ''
                    }
                ],
                price: {
                    basePrice: null,
                    discountId: ''
                },
                images: [] 
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
                                    <TabsTrigger value="fermola" className="text-sm h-full py-2">Recettes</TabsTrigger>
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
                                            <Label>Catégorie <span className='text-red-500 text-base'>*</span></Label>
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
                                                Définissez un seuil pour déclencher une alerte lorsque la quantité de cet article est faible. Par exemple, si vous entrez "30 portions", une alerte sera activée lorsque le stock atteindra ce niveau.
                                            </p>
                                            {errors.warningQuantity && (
                                                <p className="text-xs text-red-500 mt-1">{errors.warningQuantity}</p>
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
                                            Sélectionnez un ou plusieurs tags pour associer cet article à des catégories ou thèmes spécifiques. Ces tags aident à organiser et filtrer les articles. Par exemple, L'article "Pizza Margherita" peut être tagué "Italien", "Végétarien" et "Plat Principal". Lorsqu'un client choisit un tag, tous les articles correspondants s'affichent dans le menu.
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
                                                <Label>Contient des Recettes <span className='text-red-500 text-base'>*</span></Label>
                                                <Select
                                                    name="hasFormulas"
                                                    value={formData.hasFormulas === null ? "" : String(formData.hasFormulas)}
                                                    onValueChange={(value) => handleChange({ target: { name: 'hasFormulas',  value: value === 'true' } })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner une Choix" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">Oui</SelectItem>
                                                        <SelectItem value="false">Non</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                
                                                {errors.hasFormulas && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.hasFormulas}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Quantité</Label>
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    value={formData.quantity || ""}
                                                    onChange={handleChange}
                                                    placeholder='Exemple : 30 portions'
                                                    min="0"
                                                    disabled={formData.hasFormulas}
                                                />
                                                <p className="text-xs text-gray-600 mt-0">
                                                    Si "Contient des Recettes" est <strong>Non</strong>, la quantité du produit dans le menu sera directement liée à la quantité du produit en inventaire. Si <strong>Oui</strong>, la quantité sera déterminée par la <strong>Portion produite</strong>.
                                                </p>
                                                {errors.quantity && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                                                )}
                                            </div>
                                        </div> 

                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold lg:text-2xl md:text-xl sm:text-base">Les Formule</h2>
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
                                            {formData.formulas.map((formulas, index) => (
                                                <div 
                                                    key={index} 
                                                    className="border p-4 rounded-lg"
                                                >

                                                    <div className="flex justify-end">
                                                        {formData.formulas.length > 1 && (
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
                                                                value={formulas.productId || ""}
                                                                onValueChange={(value) => handleChangee2(value, index, 'productId')}
                                                                disabled={!formData.hasFormulas}
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
                                                            {errors.formulas && errors.formulas[index] && errors.formulas[index].productId && (
                                                                <p className="text-xs text-red-500 mt-1">
                                                                    {errors.formulas[index].productId}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Quantité nécessaire <span className='text-red-500 text-base'>*</span></Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="number"
                                                                    name="quantityFormula"
                                                                    value={formulas.quantityFormula !== null && formulas.quantityFormula !== undefined ? formulas.quantityFormula : ""}
                                                                    onChange={(e) => handleChangee2(e.target.value, index, 'quantityFormula')}
                                                                    placeholder='Quantité nécessaire'
                                                                    disabled={!formData.hasFormulas}
                                                                    step='any'
                                                                    min="0"
                                                                    className="flex-1"
                                                                />
                                                                
                                                                <Select
                                                                    name="unitId"
                                                                    value={formulas.unitId || ""}
                                                                    onValueChange={(value) => handleChangee2(value, index, 'unitId')}
                                                                    disabled={!formData.hasFormulas}
                                                                >
                                                                    <SelectTrigger
                                                                        className={`w-[100px] ${
                                                                            !formulas.unitId && errors.formulas?.[index]?.unitId
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
                                                            {errors.formulas && errors.formulas[index] && errors.formulas[index].quantityFormula && (
                                                                <p className="text-xs text-red-500 mt-1">
                                                                    {errors.formulas[index].quantityFormula}
                                                                </p>
                                                            )}
                                                            {errors.formulas && errors.formulas[index] && errors.formulas[index].unitId && (
                                                                <p className="text-xs text-red-500 mt-1">
                                                                    {errors.formulas[index].unitId}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Inventaire</Label>
                                                            <Select
                                                                name="inventoryId"
                                                                value={formulas.inventoryId || ""}
                                                                onValueChange={(value) => handleChangee2(value, index, 'inventoryId')}
                                                                disabled={!formulas.productId}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionner un inventaire" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {inventorys.length > 0 ? (
                                                                        inventorys
                                                                            .filter((inventory) => inventory.productId === formulas.productId)
                                                                            .map((inventory) => (
                                                                                <SelectItem key={inventory.id} value={inventory.id}>
                                                                                    {inventory.sku} 
                                                                                </SelectItem>
                                                                            )).length > 0 ? (
                                                                                inventorys
                                                                                    .filter((inventory) => inventory.productId === formulas.productId)
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
                                                            {errors.formulas && errors.formulas[index] && errors.formulas[index].warningQuantity && (
                                                                <p className="text-xs text-red-500 mt-1">
                                                                    {errors.formulas[index].warningQuantity}
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
                                                    disabled={!formData.hasFormulas}
                                                    min="0"
                                                />
                                                {errors.portionProduced && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {errors.portionProduced}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
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
                                                value={formData.price.basePrice || ""}
                                                onChange={handleChange}
                                                placeholder="Prix (ex: 100 DH)"
                                                min="0"
                                            />
                                            {errors.price?.basePrice  && (
                                                <p className="text-xs text-red-500 mt-1">{errors.price?.basePrice}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Nom de Réduction </Label>
                                            <Select
                                                name="discountId"
                                                value={formData.price.discountId}
                                                onValueChange={(value) => {
                                                    setFormData((prevFormData) => ({
                                                        ...prevFormData,
                                                        price: {
                                                            ...prevFormData.price,
                                                            discountId: value, 
                                                        },
                                                    }));
                                                }}
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
                                            {errors.price?.discountId && (
                                                <p className="text-xs text-red-500 mt-1">{errors.price?.discountId}</p>
                                            )}
                                        </div>
                                    </div>
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
                                                    className="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 border p-4 rounded-lg"
                                                >
                                                    <div className="space-y-2">
                                                        <Label>Langue <span className='text-red-500 text-base'>*</span></Label>
                                                        <Select
                                                            name="languageId"
                                                            value={translates.languageId || ""}
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
                                                        <Label>Désignation de l'article <span className='text-red-500 text-base'>*</span></Label>
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
                                                        <Label>Détails de plat <span className='text-red-500 text-base'>*</span></Label>
                                                        <Input
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

                                                    <div className="flex items-end justify-center h-full">
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