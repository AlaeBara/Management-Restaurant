import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

// Zod schema for form validation
const SuplierSchema = z.object({
    name: z.string().min(1, "Le nom du fournisseur ne peut pas être vide"),
    address: z.string().min(1, "L'adresse du fournisseur ne peut pas être vide"),
    fax: z
        .string()
        .nullable()
        .optional()
        .refine(
            (value) => value === null || value === "" || /^\d+$/.test(value),
            {
                message: "Numéro de fax invalide.",
            }
        ),
    phone:z.string()
        .min(1, "Le numéro de téléphone du fournisseur ne peut pas être vide")
        .refine(value => value === null || /^[+]?[0-9\s]*$/.test(value), {
            message: 'Numéro de téléphone invalide.',
        }),
    email: z.string().email("Format d'email invalide").nullable().optional(),
    website: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    rcNumber: z.string().min(1, "Le numéro RC du fournisseur ne peut pas être vide"),
    iceNumber: z.string().min(1, "Le numéro ICE du fournisseur ne peut pas être vide"),
    avatar: z.any().optional()
});


const STATUS = {
    ACTIVE : 'ACTIVE',
    INACTIVE : 'INACTIVE',
    BLOCKED : 'BLOCKED',
    DELETED : 'DELETED'
};


export default function Component() {
    const navigate = useNavigate()
    const [alert, setAlert] = useState({ message: null, type: null });
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        fax: '',
        phone: '',
        email: '',
        website: '',
        description: '',
        status: STATUS.ACTIVE,
        rcNumber: '',
        iceNumber: '',
      });
    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleSelectChange = ({ target: { name, value } }) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setErrors((prevErrors) => ({ ...prevErrors, avatar: '' }));
        } else {
            setFile(selectedFile);
            setErrors((prevErrors) => ({ ...prevErrors, avatar: 'Veuillez sélectionner un fichier image valide.' })); 
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setErrors((prevErrors) => ({ ...prevErrors, avatar: '' })); 
        document.getElementById('avatar').value = ''; 
    };



    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         SuplierSchema.parse(formData);

    //         const preparedData = Object.fromEntries(
    //             Object.entries(formData).filter(([key, value]) => value !== null && value !== "")
    //         );
    //         const token = Cookies.get('access_token');
    //         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers`, preparedData, {
    //             headers: {
    //             Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         setFormData({
    //             name: '',
    //             address: '',
    //             fax: '',
    //             phone: '',
    //             email: '',
    //             website: '',
    //             description: '',
    //             status: STATUS.ACTIVE,
    //             rcNumber: '',
    //             iceNumber: '',
    //         });
    //         setErrors({});

    //         setAlert({
    //             message: null,
    //             type: null
    //         });
    //         toast.success(response.data.message || 'Fournisseur créé avec succès!', {
    //             icon: '✅',
    //             position: "top-right",
    //             autoClose: 1000,
    //             onClose: () => navigate("/dash/Supliers")
    //         });
    //     } catch (error) {
    //         if (error instanceof z.ZodError) {
    //             const fieldErrors = error.errors.reduce((acc, { path, message }) => {
    //                 acc[path[0]] = message;
    //                 return acc;
    //             }, {});
    //             setErrors(fieldErrors);
    //         } else {
    //             console.error('Error creating suplier:', error.response?.data?.message || error.message);
    //             setAlert({
    //                 message: Array.isArray(error.response?.data?.message) 
    //                 ? error.response?.data?.message[0] 
    //                 : error.response?.data?.message || 'Erreur lors de la creation du Fournisseur!',
    //                 type: "error",
    //             });
    //         }
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if a file is selected and if it's an image
        if (file && !file.type.startsWith('image/')) {
            setErrors((prevErrors) => ({ ...prevErrors, avatar: 'Veuillez sélectionner un fichier image valide.' }));
            return;
        }
    
        try {
            
            SuplierSchema.parse(formData);
    
            // Prepare form data for submission
            const formDataWithFile = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    formDataWithFile.append(key, value);
                }
            });
            if (file) {
                formDataWithFile.append('avatar', file);
            }
            console.log(formDataWithFile)
            // Submit the form data
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers`, formDataWithFile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Reset the form and clear errors
            setFormData({
                name: '',
                address: '',
                fax: '',
                phone: '',
                email: '',
                website: '',
                description: '',
                status: STATUS.ACTIVE,
                rcNumber: '',
                iceNumber: '',
            });
            setFile(null);
            document.getElementById('avatar').value = '';
            setErrors({});
            // Show success message and navigate
            toast.success(response.data.message || 'Fournisseur créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate("/dash/Supliers"),
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.errors.reduce((acc, { path, message }) => {
                    acc[path[0]] = message;
                    return acc;
                }, {});
                setErrors(fieldErrors);
            } else {
                console.error('Error creating suplier:', error.response?.data?.message || error.message);
                setAlert({
                    message: Array.isArray(error.response?.data?.message)
                        ? error.response?.data?.message[0]
                        : error.response?.data?.message || 'Erreur lors de la creation du Fournisseur!',
                    type: "error",
                });
            }
        }
    };

  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Ajouter un Nouveau Fournisseurs</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour ajouter un nouveau fournisseur au système.
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
                            <Label htmlFor="name">Nom Complete <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nom Complete"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Numéro Téléphone"
                                />
                                {errors.phone && (
                                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Statut :</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleSelectChange({ target: { name: 'status', value } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={STATUS.ACTIVE}>Actif</SelectItem>
                                        <SelectItem value={STATUS.INACTIVE}>Inactif</SelectItem>
                                        <SelectItem value={STATUS.BLOCKED}>Bloqué</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-xs text-red-500 mt-1">{errors.status}</p>
                                )}
                            </div>

                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label htmlFor=" website">Site Web :</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="Site Web"
                                />
                                {errors.website && (
                                    <p className="text-xs text-red-500 mt-1">{errors.website}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fax">Fax :</Label>
                                <Input
                                    id="fax "
                                    name="fax"
                                    value={formData.fax}
                                    onChange={handleChange}
                                    placeholder="Fax "
                                />
                                {errors.fax  && (
                                    <p className="text-xs text-red-500 mt-1">{errors.fax}</p>
                                )}
                            </div>

                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Adresse"
                            />
                            {errors.address && (
                                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="E-mail"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label htmlFor="iceNumber">Numéro ICE <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="iceNumber"
                                    name="iceNumber"
                                    value={formData.iceNumber}
                                    onChange={handleChange}
                                    placeholder="Numéro ICE"
                                />
                                {errors.iceNumber && (
                                    <p className="text-xs text-red-500 mt-1">{errors.iceNumber}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rcNumber">Numéro RC <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    id="rcNumber"
                                    name="rcNumber"
                                    value={formData.rcNumber}
                                    onChange={handleChange}
                                    placeholder="Numéro RC"
                                />
                                {errors.rcNumber && (
                                    <p className="text-xs text-red-500 mt-1">{errors.rcNumber}</p>
                                )}
                            </div>

                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar du fournisseur</Label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        id="avatar"
                                        name="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="pr-10" 
                                    />
                                    {file && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                            aria-label="Remove file"
                                        >
                                            <X className="h-4 w-4" /> 
                                        </button>
                                    )}
                                </div>
                            </div>
                            {errors.avatar && (
                                <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>
                            )}
                        </div>


                    

                        <div className='flex gap-4'>

                            <Button type="submit" onClick={()=>navigate('/dash/Supliers')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                Annuler 
                            </Button>
                            <Button type="submit" className="w-full">
                                Ajouter
                            </Button>

                        </div>
                        

                    </form>
                </CardContent>
            </Card>
        </div>
    </>
  );
}
