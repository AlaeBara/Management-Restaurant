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
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {useFetchTags} from '../../Tags/hooks/useFetchTags'
import ReactSelect from 'react-select';




export default function AchatCreationForm() {
    const navigate = useNavigate();

    const { tags, fetchTags } = useFetchTags()
    useEffect(() => {
        fetchTags({fetchAll: true });
    }, [fetchTags]);


    const [alert, setAlert] = useState({ message: null, type: null });

    const [formData, setFormData] = useState({
        menuItemSku: '',
        quantity: '',
        warningQuantity: '',
        isPublished: '',
        isDraft: '',
        categoryId: '',
        avatar: null,
        tagIds: [],
        translates: [
            {
                languageId: '',
                name: '',
                description: '',
            }
        ]
    });
    
    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    // Submit handler
    const [errors, setErrors] = useState({});

    const  handler=(e)=>{
        e.preventDefault();
        console.log(formData)
    }

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
                                    <TabsTrigger value="fermola" className="text-sm h-full py-2">fermola</TabsTrigger>
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
                                                value={formData.categoryId === null ? "" : String(formData.categoryId)}
                                                onValueChange={(value) => handleChange({ target: { name: 'categoryId',  value: value === 'true' } })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une Choix" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Oui</SelectItem>
                                                    <SelectItem value="false">Non</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            
                                            {errors.categoryId && (
                                                <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
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
                                    </div>
                                   
                                </TabsContent>


                                <TabsContent value="fermola" className="space-y-4">

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                                    </div>

                                </TabsContent>


                                <TabsContent value="tag" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Tag</Label>

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
                                    {/* Translate Section */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold lg:text-2xl md:text-xl sm:text-base">Traductions de l'article du menu</h2>

                                            {formData.translates.length=== 3 ||
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

                                        {/* Product Grid */}
                                        <div className="grid gap-4">
                                            {formData.translates.map((translates, index) => (
                                                <div 
                                                    key={index} 
                                                    className="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 border p-4 rounded-lg"
                                                >
                                                    <div className="space-y-2">
                                                        <Label>Identifiant de la langue <span className='text-red-500 text-base'>*</span></Label>
                                                        <Input
                                                            name="languageId"
                                                            value={translates.languageId || ""}
                                                            onChange={(e) => handleChangee(e.target.value, index, 'languageId')}
                                                            placeholder='Identifiant de la langue'
                                                        />
                                                    
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