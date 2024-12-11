import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useFetchProduct} from '../../../Products/Hooks/useFetchProduct'
import {useFetchStorages} from '../../../Suplier&Stockage/Stockage/Hooks/useFetchStorages'
import {useFetchOneInventory} from '../Hooks//useFetchOneInventory'
import {useUpdateInventory} from '../Hooks/useUpdateInventory'
import Spinner from '@/components/Spinner/Spinner'
import { Alert, AlertDescription } from '@/components/ui/alert';



export default function Component() {
    const navigate = useNavigate()

    const {id} = useParams()

    const { product, fetchProduct  } = useFetchProduct()
    const { Storages, fetchStorage  } = useFetchStorages()
    useEffect(() => {
        fetchProduct({fetchAll: true});
        fetchStorage({fetchAll: true});
    }, []);

    const { formData, setFormData, initialData, setInitialData, message, loading } = useFetchOneInventory(id);
    const { errors, updateInventory, alert} = useUpdateInventory(id, formData, setFormData, initialData, setInitialData);

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer />

            <div className="space-y-2 m-3">
                <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour l'inventaire</h1>
                <p className="text-base text-gray-600">
                    Modifiez les informations ci-dessous pour mettre à jour l'inventaire dans le système..
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
                        <form onSubmit={updateInventory} className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU du Inventaire <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="sku"
                                    name="sku" 
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="SKU du Inventaire"
                                />
                                {errors.sku && (
                                    <p className="text-xs text-red-500 mt-1">{errors.sku}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="label">Quantité d'alerte <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="warningQuantity"
                                    name="warningQuantity"
                                    value={formData.warningQuantity || ""}
                                    onChange={handleChange}
                                    placeholder="Quantité d'alerte"
                                    type='Number'
                                />
                                {errors.warningQuantity && (
                                    <p className="text-xs text-red-500 mt-1">{errors.warningQuantity}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unitId">Emplacement de stockage <span className='text-red-500 text-base'>*</span></Label>
                                <Select
                                    id="storageId"
                                    name="storageId"
                                    value={formData.storageId || ""}
                                    onValueChange={(value) => handleChange({ target: { name: 'storageId', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner l'Emplacement de stockage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Storages.length > 0 ? (
                                            Storages
                                                .map((Storage) => (
                                                    <SelectItem key={Storage.id} value={Storage.id}>
                                                        {Storage.hierarchyPath}
                                                    </SelectItem>
                                                ))
                                        ) : (
                                            <p className='text-sm'>Aucune donnée disponible</p>
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-600 mt-0">
                                    Sélectionnez l'emplacement de stockage où cet inventaire sera géré.
                                </p>
                                {errors.storageId && (
                                    <p className="text-xs text-red-500 mt-1">{errors.storageId}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unitId">Produit associé <span className='text-red-500 text-base'>*</span></Label>
                                <Select
                                    id="productId"
                                    name="productId"
                                    value={formData.productId || ""}
                                    onValueChange={(value) => handleChange({ target: { name: 'productId', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner Produit associé" />
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
                                <p className="text-xs text-gray-600 mt-0">
                                    Sélectionnez le produit dont vous souhaitez gérer l'inventaire.
                                </p>
                                {errors.productId && (
                                    <p className="text-xs text-red-500 mt-1">{errors.productId}</p>
                                )}
                            </div>

                            <div className='flex gap-4'>

                                <Button type="submit" onClick={() => navigate('/dash/inventaires')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                   Retour
                                </Button>
                                <Button type="submit" className="w-full">
                                    Mise à jour
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