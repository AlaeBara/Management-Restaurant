import React, { useState,  useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {useFetchOneTable} from '../Hooks/useFetchOneTable'
import {useUpdateTable} from '../Hooks/UpdateTable'
import Spinner from '@/components/Spinner/Spinner';


// Table status constants
const TABLE_STATUSES = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  OCCUPIED: 'occupied',
};

export default function Component() {
    const {id , id_table}=useParams()
    const navigate = useNavigate();

    const { formData, setFormData, initialData, setInitialData, message, loading } = useFetchOneTable(id_table);
    const { errors, updateTable} = useUpdateTable(id_table, formData, setFormData, initialData, setInitialData);

    const handleChange = useCallback((e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }, [formData, setFormData]);

    const handleSelectChange = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, [setFormData]);

  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour la Table</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour mettre à jour la Table dans le système.
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
                        <form  onSubmit={updateTable} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tableName">Nom de la Table</Label>
                                <Input
                                    id="tableName"
                                    name="tableName"
                                    value={formData.tableName}
                                    onChange={handleChange}
                                    placeholder="Label de la Zone"
                                />
                                {errors.tableName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tableName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tableCode">Code de la Table</Label>
                                <Input
                                    id="tableCode"
                                    name="tableCode"
                                    value={formData.tableCode}
                                    onChange={handleChange}
                                    placeholder="Code de la Zone"
                                />
                                {errors.tableCode && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tableCode}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="isActive">État de la Table</Label>
                                <Select value={formData.isActive} 
                                    onValueChange={(value) => setFormData(prev => ({...prev,isActive: value === 'true'}))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez l'État">
                                            {formData.isActive ? 'Actif' : 'Inactif'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Actif</SelectItem>
                                        <SelectItem value="false">Inactif</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.isActive && (
                                    <p className="text-xs text-red-500 mt-1">{errors.isActive}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tableStatus">Status de la Table</Label>
                                <Select value={formData.tableStatus}
                                    onValueChange={(value) => handleSelectChange('tableStatus', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un Statut">
                                        {
                                            {
                                                [TABLE_STATUSES.AVAILABLE]: "Disponible",
                                                [TABLE_STATUSES.RESERVED]: "Réservée",
                                                [TABLE_STATUSES.OCCUPIED]: "Occupée",
                                            }[formData.tableStatus]
                                        }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={TABLE_STATUSES.AVAILABLE}>Disponible</SelectItem>
                                        <SelectItem value={TABLE_STATUSES.RESERVED}>Réservée</SelectItem>
                                        <SelectItem value={TABLE_STATUSES.OCCUPIED}>Occupée</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tableStatus && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tableStatus}</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button type="button" onClick={() => navigate(`/dash/Zone/${id}`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                    Annuler
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
