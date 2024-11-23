import React, { useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,   SelectGroup, } from "@/components/ui/select"
import {useFetchStorage} from '../Hooks/useFetchStorage'
import {useFetchStorages} from '../Hooks/useFetchStorages'
import {useUpdateStorage} from '../Hooks/useUpdateStorage'


export default function Component() {

    const navigate = useNavigate()
    const { id } = useParams();

    const { Storages, fetchStorage } = useFetchStorages()

    useEffect(() => {
        fetchStorage({ fetchAll: true });
    }, []);


    const { formData, setFormData, initialData, setInitialData , message} = useFetchStorage(id);
    const { errors, updateStorage } = useUpdateStorage(id, formData, setFormData, initialData, setInitialData);

    const handleChange = useCallback((e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }, [formData, setFormData]);
    

    return (
        <>
            <ToastContainer />

            <div className="space-y-2 m-3">
                <h1 className="text-2xl font-bold text-black font-sans">Modifier le Stock</h1>
                <p className="text-base text-gray-600">
                    Modifiez les informations ci-dessous pour mettre à jour le Stock dans le système.
                </p>
            </div>

            {message ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Erreur</p>
                    <p className="break-words">{message}</p>
                </div>

            ) : (

                <div className="container p-0 max-w-2xl">
                    <Card className="w-full border-none shadow-none">
                        <CardContent className="pt-6">
                            <form onSubmit={updateStorage} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storageCode">Code de stockage</Label>
                                    <Input
                                        id="storageCode"
                                        name="storageCode"
                                        value={formData.storageCode}
                                        onChange={handleChange}
                                        placeholder="Code de stockage"
                                    />
                                    {errors.storageCode && (
                                        <p className="text-xs text-red-500 mt-1">{errors.storageCode}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="storageName">Nom du stockage</Label>
                                    <Input
                                        id="storageName"
                                        name="storageName"
                                        value={formData.storageName}
                                        onChange={handleChange}
                                        placeholder="Nom du stockage"
                                    />
                                    {errors.storageName && (
                                        <p className="text-xs text-red-500 mt-1">{errors.storageName}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="storagePlace">Emplacement du stockage</Label>
                                    <Input
                                        id="storagePlace"
                                        name="storagePlace" 
                                        value={formData.storagePlace || ""}
                                        onChange={handleChange}
                                        placeholder="Emplacement du stockage"
                                    />
                                    {errors.storagePlace && (
                                        <p className="text-xs text-red-500 mt-1">{errors.storagePlace}</p>
                                    )}
                                </div>
                                {/* <div className="space-y-2">
                                    <label
                                        htmlFor="subStorageId"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Identifiant du sous-stockage
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="subStorageId"
                                            value={formData.subStorageId || ""}
                                            onChange={(e) =>
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    subStorageId: e.target.value,
                                                }))
                                            }
                                            className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="" disabled>
                                                {formData.subStorageId
                                                    ? Storages.find(
                                                        (storage) => storage.id === formData.subStorageId
                                                    )?.storageName
                                                    : "Sélectionner du sous-stockage"}
                                            </option>
                                            {Storages.length > 0 ? (
                                                Storages.map((storage) => (
                                                    <option key={storage.id} value={storage.id}>
                                                        {storage.storageName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Aucune donnée disponible</option>
                                            )}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg
                                                className="w-4 h-4 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="space-y-2">
                                    <Label htmlFor="subStorageId">
                                        Identifiant du sous-stockage
                                    </Label>
                                    <Select
                                        value={formData.subStorageId || ""}
                                        onValueChange={(value) => {
                                            if (value) {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    subStorageId: value, 
                                                }));
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    Storages.find((storage) => storage.id === formData.subStorageId)?.storageName ||
                                                    "Sélectionner du sous-stockage"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Storages.length > 0 ? (
                                                    Storages.map((storage) => (
                                                        <SelectItem key={storage.id} value={storage.id}>
                                                            {storage.storageName}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <p>Aucune donnée disponible</p>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-600 mt-0">
                                        Sélectionnez un stockage parent si ce stockage doit être rattaché à un stockage existant. Cette hiérarchisation permet d'organiser les stockages de manière structurée.
                                    </p>
                                </div>
                         
                                <div className='flex gap-4'>

                                    <Button type="submit" onClick={() => navigate('/dash/Storage')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                        Annuler
                                    </Button>
                                    <Button type="submit" className="w-full">
                                        Ajouter
                                    </Button>

                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </div >
                )
            }
        </>
    );
}