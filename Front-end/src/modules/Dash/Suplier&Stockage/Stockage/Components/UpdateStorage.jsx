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
import Spinner from '@/components/Spinner/Spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';


export default function Component() {

    const navigate = useNavigate()
    const { id } = useParams();

    const { Storages, fetchStorage } = useFetchStorages()

    useEffect(() => {
        fetchStorage({ fetchAll: true });
    }, []);


    const { formData, setFormData, initialData, setInitialData , message , loading} = useFetchStorage(id);
    const { errors, updateStorage,alert } = useUpdateStorage(id, formData, setFormData, initialData, setInitialData);

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
                            <form onSubmit={updateStorage} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storageCode">Code de stockage <span className='text-red-500 text-base'>*</span></Label>
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
                                    <Label htmlFor="storageName">Nom du stockage <span className='text-red-500 text-base'>*</span></Label>
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

                                {/* <div className="space-y-2">
                                    <label
                                        htmlFor="parentStorageId"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Identifiant du sous-stockage
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="parentStorageId"
                                            value={formData.parentStorageId || ""}
                                            onChange={(e) =>
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    parentStorageId: e.target.value,
                                                }))
                                            }
                                            className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="" disabled>
                                                {formData.parentStorageId
                                                    ? Storages.find(
                                                        (storage) => storage.id === formData.parentStorageId
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
                                    <Label htmlFor="parentStorageId">
                                        Hiérarchie
                                    </Label>
                                    <Select
                                        value={formData.parentStorageId || ""}
                                        onValueChange={(value) => {
                                            if (value) {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    parentStorageId: value, 
                                                }));
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    Storages.find((storage) => storage.id === formData.parentStorageId)?.hierarchyPath ||
                                                    "Sélectionner Hiérarchie"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Storages.length > 0 ? (
                                                    Storages.map((storage) => (
                                                        <SelectItem key={storage.id} value={storage.id}>
                                                            {storage.hierarchyPath}
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
                )
            }
        </>
    );
}