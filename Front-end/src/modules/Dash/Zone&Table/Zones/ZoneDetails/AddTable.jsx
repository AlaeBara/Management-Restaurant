import React, { useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Loader} from 'lucide-react'

// Table status constants
const TABLE_STATUSES = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  OCCUPIED: 'occupied',
};

// Zod schema for form validation
const zoneAddSchema = z.object({
  tableName: z.string().nonempty("Le nom de la table est requis"),
  tableCode: z.string().nonempty("Le code de la table est requis"),
  isActive: z.boolean().optional(),
  tableStatus: z.string().optional(),
});

export default function Component() {
    const {id}=useParams()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        zoneUUID: id,
        tableName: '',
        tableCode: '',
        isActive: true,
        tableStatus: TABLE_STATUSES.AVAILABLE,
    });
    const [errors, setErrors] = useState({});

    const [alert, setAlert] = useState({ message: null, type: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            zoneAddSchema.parse(formData);

            setIsLoading(true);
            const token = Cookies.get('access_token');
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tables`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                zoneUUID: '',
                tableName: '',
                tableCode: '',
                isActive: true,
                tableStatus: TABLE_STATUSES.AVAILABLE,
            });
            setErrors({});
            setAlert({
                message: null,
                type: null
            });
            toast.success(response.data.message ||'Table créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/Zone/${id}`),
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
            console.error('Error creating zone:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message[0] 
                : error.response?.data?.message || 'Erreur lors de la creation de la table!',
                type: "error",
            });
            setIsLoading(false);
        }
        }
    };

  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau Table Dans La Zone</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour ajouter un nouveau Zone au système.
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
                    <div className="space-y-2">
                        <Label htmlFor="tableName">Nom de la Table  <span className='text-red-500 text-base'>*</span></Label>
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
                        <Label htmlFor="tableCode">Code de la Table  <span className='text-red-500 text-base'>*</span></Label>
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
                        <Select value={formData.isActive} onValueChange={(value) => handleSelectChange('isActive', value === 'true')}>
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
                        <Select value={formData.tableStatus} onValueChange={(value) => handleSelectChange('tableStatus', value)}>
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
