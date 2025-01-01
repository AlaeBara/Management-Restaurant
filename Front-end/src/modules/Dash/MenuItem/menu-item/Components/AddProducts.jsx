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
import { Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {useFetchTags} from '../../Tags/hooks/useFetchTags'
import {useFetchCategory} from '../../../Category/Hooks/useFetchCategory'
import {useFetchLangages} from '../hooks/useFetchLangages'
import {useFetchProduct} from '../../../Products/Hooks/useFetchProduct'
import {useFetchUnits} from '../../../Units/Hooks/useFetchUnits'
import {useFetchDiscounts} from '../../../MenuItem/Discount/Hooks/useFetchDiscounts'
import ReactSelect from 'react-select';



    const fomulastemSchema = z.object({
        productId: z
            .string()
            .nullable()
            .optional(),

        warningQuantity: z.coerce
            .number({
                required_error: "Le Quantité d'alerte est obligatoire.",
                invalid_type_error: "Le Quantité d'alerte doit être un nombre.",
            })
            .nonnegative({ message: "Le Quantité d'alerte doit être un nombre positif." }).optional(),

        quantityFormula:z.coerce
            .number({
                required_error: "Le Quantité dans la formule est obligatoire.",
                invalid_type_error: "Le Quantité dans la formule doit être un nombre.",
            })
            .nonnegative({ message: "Le Quantité dans la formule doit être un nombre positif." }).optional(),

        portionProduced:z.coerce
            .number({
                required_error: "Le Portion produite est obligatoire.",
                invalid_type_error: "Le Portion produite doit être un nombre.",
            })
            .nonnegative({ message: "Le Portion produite doit être un nombre positif." }).optional(),

        unitId:z
            .string()
            .nullable()
            .optional(),

    });

    const priceSchema = z.object({
        basePrice: z.coerce
            .number({
                required_error: "Le prix de base est obligatoire.",
                invalid_type_error: "Le prix doit être un nombre.",
            })
            .nonnegative({ message: "Le prix doit être un nombre positif." }),
        discountId: z.string().nullable().optional(),
    }).required({ message: "Les informations de prix sont obligatoires" });


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
            .nonempty({ message: "Sku de l'aricle est obligatoire." }),

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
            .nonnegative({ message: "Le Quantité d'alerte doit être un nombre positif." }).optional(),

        isPublished: z.boolean().optional(),

        isDraft: z.boolean().optional(),

        hasFormulas: z.boolean().optional(),

        categoryId:  z
            .string()
            .nonempty({ message: "La Catégorie est obligatoire." }),

        // avatar: z.string()
        //     .url("L'image de produit doit être une URL valide") 
        //     .optional(), 

        price: priceSchema,

    });



export default function AchatCreationForm() {
    const navigate = useNavigate();

    const { tags, fetchTags } = useFetchTags()
    const { categories,  fetchCategorie} = useFetchCategory()
    const {langages, fetchLangage} =useFetchLangages()
    const { product, fetchProduct} = useFetchProduct()
    const { units , fetchUnits} = useFetchUnits()
    const { discounts,  fetchDiscounts } =useFetchDiscounts()

    useEffect(() => {
        fetchTags({fetchAll: true });
        fetchCategorie({fetchAll: true });
        fetchLangage({fetchAll: true });
        fetchProduct({fetchAll: true });
        fetchUnits({fetchAll: true })
        fetchDiscounts({fetchAll: true })
    }, [fetchTags,fetchCategorie,fetchLangage,fetchProduct,fetchUnits]);


    const [alert, setAlert] = useState({ message: null, type: null });

    const [formData, setFormData] = useState({
        menuItemSku: '',
        quantity: '',
        warningQuantity: '',
        isPublished: false,
        isDraft: false,
        // avatar: '',
        categoryId: '',
        hasFormulas: false,
        formulas: [
            {
                productId: '',
                warningQuantity:  null,
                quantityFormula: null,
                portionProduced:  null,
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
        }
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
    

    //forTags
    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

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
       
        const numericFields = ['warningQuantity', 'quantityFormula', 'portionProduced'];
        
        const processedValue = numericFields.includes(field) ? Number(value) || '' : value;
    
        const updatedItems = [...formData.formulas];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: processedValue
        };
    
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
                warningQuantity:  null,
                quantityFormula: null,
                portionProduced:  null,
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

    const handler = async (e) => {
        e.preventDefault();
        try {
            if(formData.price.basePrice){
                formData.price.basePrice = parseFloat(formData.price.basePrice);
            }

            if(formData.price.discountId===""){
                formData.price.discountId=null
            }



            formData.quantity = parseFloat(formData.quantity);
            formData.warningQuantity = parseFloat(formData.warningQuantity);

            // Validate formulas if hasFormulas is true
            if (!formData.hasFormulas) {
                formData.formulas = [];
            }

            ProductSchema.parse(formData);

            const preparedData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null && value !== "" && (!Array.isArray(value) || value.length !== 0))
            );
    
            const token = Cookies.get('access_token');
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/menu-items`, preparedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                menuItemSku: '',
                quantity: '',
                warningQuantity: '',
                isPublished: false,
                isDraft: false,
                // avatar: '',
                categoryId: '',
                hasFormulas: false,
                formulas: [
                    {
                        productId: '',
                        warningQuantity: '',
                        quantityFormula: '',
                        portionProduced: '',
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
                }
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
        } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce((acc, err) => {
                const { path = [], message } = err;
        
                if (path.length === 1) {
                    acc[path[0]] = message;
                }
                
                else if (path[0] === 'formulas' || path[0] === 'translates') {
                    const [field, index, subfield] = path;
                    acc[field] = acc[field] || [];
                    acc[field][index] = acc[field][index] || {};
                    acc[field][index][subfield] = message;
                }
                return acc;
            }, {});
            
            console.log(fieldErrors);
            setErrors(fieldErrors);
        
        } else {
            console.error('Error creating produits:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message[0] 
                : error.response?.data?.message || 'Erreur lors de la creation du Produit!',
                type: "error",
            });
        }
        }
    };


    return (
        <div className="w-full">

            <ToastContainer />
            <div className="space-y-2 p-4">
                <h1 className="text-2xl font-bold text-black font-sans">Ajouter un Nouvel Produit</h1>
                <p className="text-base text-gray-600">
                    Remplissez les informations ci-dessous pour ajouter un nouvel Produit au menu.
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
                                    <TabsTrigger value="translations" className="text-sm h-full py-2">Traductions</TabsTrigger>
                                    <TabsTrigger value="tag" className="text-sm h-full py-2">tag</TabsTrigger>
                                    <TabsTrigger value="fermola" className="text-sm h-full py-2">Formule</TabsTrigger>
                                </TabsList>


                                <TabsContent value="basic" className="space-y-6 mt-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        <div className="space-y-2">
                                            <Label>SKU de l'article du menu <span className='text-red-500 text-base'>*</span></Label>
                                            <Input
                                                name="menuItemSku"
                                                value={formData.menuItemSku}
                                                onChange={handleChange}
                                                placeholder="SKU de l'article du menu"
                                            />
                                            {errors.menuItemSku && (
                                                <p className="text-xs text-red-500 mt-1">{errors.menuItemSku}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Quantité <span className='text-red-500 text-base'>*</span></Label>
                                            <Input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity || ""}
                                                onChange={handleChange}
                                                placeholder='Quantité'
                                                min="0"
                                            />
                                            {errors.quantity && (
                                                <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                                            )}
                                        </div>

                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Quantité d'alerte <span className='text-red-500 text-base'>*</span></Label>
                                            <Input
                                                type="number"
                                                name="warningQuantity"
                                                value={formData.warningQuantity || ""}
                                                onChange={handleChange}
                                                placeholder='Quantité'
                                                min="0"
                                            />
                                            {errors.warningQuantity && (
                                                <p className="text-xs text-red-500 mt-1">{errors.warningQuantity}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Publié</Label>
                                            <Select
                                                name="isPublished"
                                                value={formData.isPublished === null ? "" : String(formData.isPublished)}
                                                onValueChange={(value) => handleChange({ target: { name: 'isPublished',  value: value === 'true' } })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une Choix" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Oui</SelectItem>
                                                    <SelectItem value="false">Non</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.isPublished && (
                                                <p className="text-xs text-red-500 mt-1">{errors.isPublished}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        <div className="space-y-2">
                                            <Label>Brouillon </Label>
                                            <Select
                                                name="isDraft"
                                                value={formData.isDraft === null ? "" : String(formData.isDraft)}
                                                onValueChange={(value) => handleChange({ target: { name: 'isDraft',  value: value === 'true' } })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une Choix" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Oui</SelectItem>
                                                    <SelectItem value="false">Non</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.isDraft && (
                                                <p className="text-xs text-red-500 mt-1">{errors.isDraft}</p>
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
                                    </div>


                                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}

                                        {/* <div className="space-y-2">
                                            <Label>Image de produit </Label>
                                            <Input
                                                name="avatar"
                                                value={formData.avatar || ""}
                                                onChange={handleChange}
                                                placeholder='Image de produit'
                                            />
                                            {errors.avatar && (
                                                <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>
                                            )}
                                        </div> */}

                                        
                                    {/* </div> */}
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Prix <span className='text-red-500 text-base'>*</span></Label>
                                            <Input
                                                type="number"
                                                name="basePrice"
                                                value={formData.price.basePrice || ""}
                                                onChange={handleChange}
                                                placeholder='Prix'
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
                                                <SelectContent>
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


                                <TabsContent value="fermola" className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Contient des formules <span className='text-red-500 text-base'>*</span></Label>
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

                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold lg:text-2xl md:text-xl sm:text-base">Les Formule</h2>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={addFormule}
                                                className="flex items-center gap-2"
                                            >
                                                <Plus size={16} /> Ajouter Formule
                                            </Button>
                                            
                                        </div>
                                        <div className="grid gap-4">
                                            {formData.formulas.map((formulas, index) => (
                                                <div 
                                                    key={index} 
                                                    className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 border p-4 rounded-lg"
                                                >
                                                    <div className="space-y-2">
                                                        <Label>Produit</Label>
                                                        <Select
                                                            name="productId"
                                                            value={formulas.productId || ""}
                                                            onValueChange={(value) => handleChangee2(value, index, 'productId')}
                                                            disabled={!formData.hasFormulas}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner une Choix" />
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
                                                        <Label>Quantité d'alerte</Label>
                                                        <Input
                                                            type="number"
                                                            name="warningQuantity"
                                                            value={formulas.warningQuantity || ""}
                                                            onChange={(e) => handleChangee2(e.target.value, index, 'warningQuantity')}
                                                            placeholder="Quantité d'alerte"
                                                            disabled={!formData.hasFormulas}
                                                            min="0"
                                                        />
                                                        {errors.formulas && errors.formulas[index] && errors.formulas[index].warningQuantity && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {errors.formulas[index].warningQuantity}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Quantité dans la formule</Label>
                                                        <Input
                                                            type="number"
                                                            name="quantityFormula"
                                                            value={formulas.quantityFormula || ""}
                                                            onChange={(e) => handleChangee2(e.target.value, index, 'quantityFormula')}
                                                            placeholder='Quantité dans la formule'
                                                            disabled={!formData.hasFormulas}
                                                            min="0"
                                                        />
                                                    
                                                        {errors.formulas && errors.formulas[index] && errors.formulas[index].quantityFormula && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {errors.formulas[index].quantityFormula}
                                                            </p>
                                                        )}
                                                    </div>


                                                    <div className="space-y-2">
                                                        <Label>Portion produite</Label>
                                                        <Input
                                                            type="number"
                                                            name="portionProduced"
                                                            value={formulas.portionProduced || ""}
                                                            onChange={(e) => handleChangee2(e.target.value, index, 'portionProduced')}
                                                            placeholder='Quantité dans la formule'
                                                            disabled={!formData.hasFormulas}
                                                            min="0"
                                                        />
                                                    
                                                        {errors.formulas && errors.formulas[index] && errors.formulas[index].portionProduced && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {errors.formulas[index].portionProduced}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>L'unité</Label>
                                                        <Select
                                                            name="unitId"
                                                            value={formulas.unitId|| ""}
                                                            onValueChange={(value) => handleChangee2(value, index, 'unitId')}
                                                            disabled={!formData.hasFormulas}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner une Choix" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {units.length > 0 ? (
                                                                    units
                                                                        .map((unit) => (
                                                                            <SelectItem key={unit.id} value={unit.id}>
                                                                                {unit.unit}
                                                                            </SelectItem>
                                                                        ))
                                                                ) : (
                                                                    <p className='text-sm'>Aucune donnée disponible</p>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    
                                                        {errors.formulas && errors.formulas[index] && errors.formulas[index].unitId && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {errors.formulas[index].unitId}
                                                            </p>
                                                        )}
                                                    </div>

                
                                                    <div className="flex items-end justify-center h-full">
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
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>


                                <TabsContent value="tag" className="space-y-4">
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
                                        {errors.tagIds && (
                                            <p className="text-xs text-red-500 mt-1">{errors.tagIds}</p>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="translations" className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold lg:text-2xl md:text-xl sm:text-base">Traductions de l'article du menu</h2>
                                            {formData.translates.length === 3 ||
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={addTranslate}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Plus size={16} /> Ajouter Traductions
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
                                                        <Label>Nom du produit du menu <span className='text-red-500 text-base'>*</span></Label>
                                                        <Input
                                                            name="name"
                                                            value={translates.name || ""}
                                                            onChange={(e) => handleChangee(e.target.value, index, 'name')}
                                                            placeholder='Nom du produit du menu'
                                                        />
                                                    
                                                        {errors.translates && errors.translates[index] && errors.translates[index].name && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {errors.translates[index].name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Description du produit du menu <span className='text-red-500 text-base'>*</span></Label>
                                                        <Input
                                                            name="description"
                                                            value={translates.description || ""}
                                                            onChange={(e) => handleChangee(e.target.value, index, 'description')}
                                                            placeholder='Description du produit du menu'
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
                                    <Button type="button" onClick={() => navigate('/dash/produits-menu')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                        Annuler
                                    </Button>
                                    <Button type="submit" className="w-full">
                                        Ajouter
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