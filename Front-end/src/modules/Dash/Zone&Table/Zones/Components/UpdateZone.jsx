import React, {useCallback, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchOneZone } from "../Hooks/useFetchOneZone";
import { useUpdateZone } from '../Hooks/useUpdateZone';
import { useFetchZone } from "../Hooks/useFetchZone";
import Spinner from '@/components/Spinner/Spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';


export default function Component() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch data of zone
    const { formData, setFormData, initialData, setInitialData, message, loading } = useFetchOneZone(id);
    const { errors, updateRole,alert } = useUpdateZone(id, formData, setFormData, initialData, setInitialData);

    const handleChange = useCallback((e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }, [formData, setFormData]);

    const { zones, fetchZones } = useFetchZone();

    useEffect(() => {
        fetchZones({fetchAll : true});
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="space-y-2 m-3">
                <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour la Zone</h1>
                <p className="text-base text-gray-600">
                    Modifiez les informations ci-dessous pour mettre à jour la Zone dans le système.
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
                            <form onSubmit={updateRole} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Label de la Zone <span className='text-red-500 text-base'>*</span></Label>
                                    <Input
                                        id="zoneLabel"
                                        name="zoneLabel"
                                        value={formData.zoneLabel}
                                        onChange={handleChange}
                                        placeholder="Exemple: Zone Terrasse"
                                    />
                                    {errors.zoneLabel && (
                                        <p className="text-xs text-red-500 mt-1">{errors.zoneLabel}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="label">Code de la Zone <span className='text-red-500 text-base'>*</span></Label>
                                    <Input
                                        id="zoneCode"
                                        name="zoneCode"
                                        value={formData.zoneCode}
                                        onChange={handleChange}
                                        placeholder="Exemple: ZT-001"
                                    />
                                    {errors.zoneCode && (
                                        <p className="text-xs text-red-500 mt-1">{errors.zoneCode}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="parentZoneUUID">Zone Parent</Label>
                                    <Select
                                        id="parentZoneUUID"
                                        name="parentZoneUUID"
                                        value={formData.parentZoneUUID || ""}
                                        onValueChange={(value) => handleChange({ target: { name: 'parentZoneUUID', value } })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    zones.find((zone) => zone.id === formData.parentZoneUUID)?.zoneLabel ||
                                                    'Sélectionner la zone parent'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {zones.length > 0 ? (
                                                zones
                                                    .filter((zone) => zone.id !== id)
                                                    .map((zone) => (
                                                        <SelectItem key={zone.id} value={zone.id}>
                                                            {zone.zoneLabel}
                                                        </SelectItem>
                                                    ))
                                            ) : (
                                                <p>Aucune donnée disponible</p>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-600 mt-0">
                                        Sélectionnez une zone parent si cette zone doit être rattachée à une zone existante. Cette hiérarchisation permet d'organiser les zones de manière structurée.
                                    </p>
                                    {errors.parentZoneUUID && (
                                        <p className="text-xs text-red-500 mt-1">{errors.parentZoneUUID}</p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => navigate('/dash/zones')}
                                        className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]"
                                    >
                                        Retour
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
