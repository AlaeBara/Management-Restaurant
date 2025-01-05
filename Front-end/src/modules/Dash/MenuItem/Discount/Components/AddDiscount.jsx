import React, { useState,useEffect ,useCallback} from 'react';
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
import ReactSelect from 'react-select';
import {Loader} from 'lucide-react'



const DiscountSchema = z.object({
    discountSku: z
        .string()
        .min(3, { message: "Le code SKU de la réduction doit comporter au moins 3 caractères." })
        .max(15, { message: "Le code SKU de la réduction ne peut pas dépasser 15 caractères." })
        .nonempty({ message: "Le code SKU de la réduction est obligatoire." }),


    discountType: z
        .string()
        .nonempty({ message: "Le type de réduction est obligatoire." }),

    discountValue: z.coerce
        .number({
            required_error: "La valeur de la remise est obligatoire.",
            invalid_type_error: "La valeur de la remise doit être un nombre.",
        })
        .nonnegative({ message: "La valeur de la remise  doit être un nombre positif." }),

    usageQuota:z.coerce
        .number({
            required_error: "Le quota d'utilisation de la remise est obligatoire.",
            invalid_type_error: "Le quota d'utilisation de la remisedoit être un nombre.",
        })
        .nonnegative({ message: "Le quota d'utilisation de la remise doit être un nombre positif." }).optional(),

    discountMethod: z
        .string()
        .nonempty({ message: "Le type de la remise est obligatoire." }),

    isActive:z.boolean().optional(),

    specificTime:z.boolean().optional(),

    startDate: z
        .string()
        .nullable()
        .optional(),

    endDate: z
        .string()
        .nullable()
        .optional(),

    startTime: z
        .string()
        .nullable()
        .optional(),

    endTime: z
        .string()
        .nullable()
        .optional(),

    activeDays: z
        .array(z.string())
        .optional()
        .refine(
            (days) => days.every((day) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)),
            {
                message: "Les jours actifs doivent être des jours de la semaine valides.",
            }
        )
});



export default function Component() {

    const navigate = useNavigate();


    const [alert, setAlert] = useState({ message: null, type: null });
   

    const statuses = [
        { value: 'percentage', label: 'Pourcentage' },
        { value: 'fixed', label: 'Montant fixe' },
    ];


    const discountType = [
        { value: 'regularly', label: 'Régulièrement' },
        { value: 'limited_date', label: 'Date limitée' },
        { value: 'quantity', label: 'Quantité' },
    ];
    
    
      
    
    const [formData, setFormData] = useState({
        discountSku: '',
        discountMethod: '',
        discountType: '',
        discountValue:null,
        isActive : true,

        specificTime :false,

        startDate:'',
        endDate:'',

        startTime: '',
        endTime: '',

        activeDays:[],

        usageQuota:null
    });

    const daysOptions = [
        { value: 'Monday', label: 'Lundi' },
        { value: 'Tuesday', label: 'Mardi' },
        { value: 'Wednesday', label: 'Mercredi' },
        { value: 'Thursday', label: 'Jeudi' },
        { value: 'Friday', label: 'Vendredi' },
        { value: 'Saturday', label: 'Samedi' },
        { value: 'Sunday', label: 'Dimanche' },
    ];

    

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const resetTimeRestrictionFields = useCallback(() => {
        setFormData((prev) => ({
        ...prev,
        startTime: '',
        endTime: '',
        activeDays: [],
        }));
    }, []);

    useEffect(() => {
        setFormData(prevData => {
            let updatedData = { ...prevData };
    
            if (updatedData.discountType !== 'regularly') {
                resetTimeRestrictionFields();
            }
    
            if (updatedData.discountType !== 'limited_date') {
                updatedData.startDate = '';
                updatedData.endDate = '';
            }

            if (!updatedData.specificTime) {
                updatedData.startTime = '';
                updatedData.endTime = '';
            }
    
            if (updatedData.discountType !== 'quantity') {
                updatedData.usageQuota = null;
            }
    
            return updatedData;
        });
    }, [formData.discountType, formData.specificTime ,resetTimeRestrictionFields]);
    

    

    const [isLoading, setIsLoading] = useState(false);

    const Submit = async (e) => {
        e.preventDefault();
        try {
            // Parse discountValue and usageQuota
            formData.discountValue = parseFloat(formData.discountValue);
            if (formData.usageQuota) {
                formData.usageQuota = parseFloat(formData.usageQuota);
            }
    
            let customErrors = {};
    
            // Check if startDate and endDate are valid
            if (formData.startDate && formData.endDate) {
                const startDate = new Date(formData.startDate);
                const endDate = new Date(formData.endDate);
                if (startDate >= endDate) {
                    customErrors.startDate = "La date de fin doit être supérieure à la date de début.";
                }
            }
    
            // Check if startTime and endTime are valid
            if (formData.startTime && formData.endTime) {
                const startTime = new Date(`1970-01-01T${formData.startTime}`);
                const endTime = new Date(`1970-01-01T${formData.endTime}`);
                if (startTime >= endTime) {
                    customErrors.startTime = "L'heure de fin doit être supérieure à l'heure de début.";
                }
            }

            if(formData.discountType === 'quantity' && !formData.usageQuota){
                customErrors.usageQuota="Le quota d'utilisation est requis pour les réductions basées sur la quantité"
            }
    
            // Check if specificTime and discountType are properly handled
            if(formData.discountType === 'regularly' && formData.activeDays.length === 0){
                customErrors.activeDays='Les jours actifs sont requis pour les réductions à horaires spécifiques de type quotidien'
            }

            if (formData.specificTime) {
                if (formData.discountType === 'regularly' || formData.discountType === 'limited_date') {
                    if (!formData.startTime || !formData.endTime) {
                        customErrors.startTime = "Veuillez entrer toutes les informations de temps (heure) pour activer l'option spécifique.";
                        customErrors.endTime = "Veuillez entrer toutes les informations de temps (heure) pour activer l'option spécifique.";
                    }
                }
            }

            
            if (formData.discountType === 'limited_date') {
                if (!formData.startDate || !formData.endDate) {
                    customErrors.startDate = "Veuillez entrer toutes les informations de temps (date) pour activer l'option spécifique.";
                    customErrors.endDate = "Veuillez entrer toutes les informations de temps (date) pour activer l'option spécifique.";
                }
            }
            
            // Validate form data with DiscountSchema and merge errors
            try {
                DiscountSchema.parse(formData);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    error.errors.forEach(({ path, message }) => {
                        customErrors[path[0]] = message;
                    });
                }
            }
    
            // Handle custom errors
            if (Object.keys(customErrors).length > 0) {
                setErrors(customErrors);
                return;
            }
    
            const preparedData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null && value !== "" && (!Array.isArray(value) || value.length !== 0))
            );

            setIsLoading(true);
            // Send the data to the backend
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/menu-item-discounts`, preparedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Reset form and display success message
            setFormData({
                discountSku: '',
                discountMethod: '',
                discountType: '',
                discountValue: null,
                isActive: true,
                specificTime: false,
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                activeDays: [],
                usageQuota: null
            });
            setErrors({});

            setAlert({
                message: null,
                type: null
            });
    
            toast.success(response.data.message || 'Code promo créé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 1000,
                onClose: () => navigate(`/dash/code-promo`),
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Erreur lors de la création du code promo:', error.response?.data?.message || error.message);
            setAlert({
                message: Array.isArray(error.response?.data?.message)
                    ? error.response?.data?.message[0]
                    : error.response?.data?.message || 'Erreur lors de la création du code promo',
                type: "error",
            });
            setIsLoading(false);
        }
    };
    
   
  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouveau code promo</h1>
            <p className="text-base text-gray-600">
            Remplissez les informations ci-dessous pour ajouter un nouveau code promo au système.
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

                    <form onSubmit={Submit} className="space-y-4">

                        <p className="text-sm mt-0 text-gray-600">
                            Ce formulaire permet de créer une nouvelle réduction. Vous pouvez spécifier le type de réduction (par exemple, <strong>pourcentage</strong> ou <strong>montant fixe</strong>), 
                            définir une période de validité, et même limiter l'utilisation de la réduction à des jours ou heures spécifiques. 
                            Assurez-vous de remplir tous les champs requis pour éviter des erreurs lors de la soumission.
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="discountSku">SKU de la réduction  <span className='text-red-500 text-base'>*</span></Label>
                            <Input
                                id="discountSku"
                                name="discountSku"
                                value={formData.discountSku || ''}
                                onChange={handleChange}
                                placeholder="Exemple : DISCOUNT2023"
                            />
                            <p className="text-xs text-gray-600 mt-0">Entrez un identifiant unique pour la réduction.</p>
                            {errors.discountSku && (
                                <p className="text-xs text-red-500 mt-1">{errors.discountSku}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="discountMethod">Type de la remise <span className='text-red-500 text-base'>*</span></Label>
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
                                <Label htmlFor="reference">Valeur de la remise <span className='text-red-500 text-base'>*</span></Label>
                                <Input
                                    type='Number'
                                    id="discountValue"
                                    name="discountValue"
                                    value={formData.discountValue || ''}
                                    onChange={handleChange}
                                    placeholder="Exemple : 10"
                                    min="0"
                                    step="any"
                                    disabled={!formData.discountMethod}
                                    max={formData.discountMethod === 'percentage' ? '100' : undefined}
                                
                                />
                                {errors.discountValue && (
                                <p className="text-xs text-red-500 mt-1">{errors.discountValue}</p>
                                )}
                            </div>
                            
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="isActive">Status</Label>
                            <Select
                                id="isActive"
                                name="isActive"
                                value={formData.isActive !== null ? (formData.isActive ? 'true' : 'false') : ''}
                                onValueChange={(value) => handleChange({ target: { name: 'isActive', value: value === 'true' } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le status" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    <SelectItem value="true">Actif</SelectItem>
                                    <SelectItem value="false">Inactif</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.isActive && (
                                <p className="text-xs text-red-500 mt-1">{errors.isActive}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="discountType">Type de Réduction <span className='text-red-500 text-base'>*</span></Label>
                            <Select
                                id="discountType"
                                name="discountType"
                                value={formData.discountType  || ""}
                                onValueChange={(value) => handleChange({ target: { name: 'discountType', value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le type de réduction" />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {discountType.length > 0 ? (
                                        discountType
                                            .map((Type) => (
                                                <SelectItem key={Type.value} value={Type.value}>
                                                    {Type.label}
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <p className='text-sm'>Aucune donnée disponible</p>
                                    )}
                                </SelectContent>
                            </Select>
                            
                            {errors.discountType && (
                                <p className="text-xs text-red-500 mt-1">{errors.discountType}</p>
                            )}
                        </div>

                        {formData.discountType === 'regularly' && ( 
                            <div className="space-y-2">
                                <Label htmlFor="activeDays">Jours actifs </Label>
                                <ReactSelect
                                    id="activeDays"
                                    isMulti
                                    options={daysOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={daysOptions.filter((day) => formData.activeDays.includes(day.value))}
                                    onChange={(selectedOptions) =>
                                    handleSelectChange(
                                        'activeDays',
                                        selectedOptions.map((option) => option.value)
                                    )
                                    }
                                    menuPlacement="top" 
                                />
                                {errors.activeDays && (
                                    <p className="text-xs text-red-500 mt-1">{errors.activeDays}</p>
                                )}
                            </div>
                        )}
                        
                        
                        {formData.discountType ==='limited_date'  && ( 
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Date  début </Label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate || ""}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.startDate && (
                                        <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Date fin</Label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate || ""}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.endDate && (
                                        <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
                                    )}
                                </div>

                            </div>
                       )}

                        {(formData.discountType === 'limited_date' || formData.discountType === 'regularly') && ( 
                            <div className="space-y-2">
                                <Label htmlFor="isActive">Le temps spécifique de la réduction</Label>
                                <Select
                                    id="specificTime"
                                    name="specificTime"
                                    value={formData.specificTime !== null ? (formData.specificTime ? 'true' : 'false') : ''}
                                    onValueChange={(value) => handleChange({ target: { name: 'specificTime', value: value === 'true' } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un Choix" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-48 overflow-y-auto">
                                        <SelectItem value="true">Oui</SelectItem>
                                        <SelectItem value="false">Non</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.specificTime && (
                                    <p className="text-xs text-red-500 mt-1">{errors.specificTime}</p>
                                )}
                            </div>
                        )}

                        {formData.specificTime && (formData.discountType ==='regularly' || formData.discountType === 'limited_date' )  && ( 
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Heure de début </Label>
                                    <input
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        value={formData.startTime || ""}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.startTime && (
                                        <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endTime">Heure de fin</Label>
                                    <input
                                        type="time"
                                        id="endTime"
                                        name="endTime"
                                        value={formData.endTime || ""}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.endTime && (
                                        <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>
                                    )}
                                </div>

                            </div>
                       )}


                        {formData.discountType ==='quantity' && ( 
                            <div className="space-y-2">
                                <Label htmlFor="usageQuota">Quota d'utilisation de la remise </Label>
                                <Input
                                    type='Number'
                                    id="usageQuota"
                                    name="usageQuota"
                                    value={formData.usageQuota || ''}
                                    onChange={handleChange}
                                    placeholder="Exemple : 100"
                                    min="0"
                                />
                                <p className="text-xs text-gray-500">Entrez le nombre maximum d'utilisations de la réduction.</p>
                                {errors.usageQuota && (
                                    <p className="text-xs text-red-500 mt-1">{errors.usageQuota}</p>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button type="button" onClick={() => navigate(`/dash/code-promo`)} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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
