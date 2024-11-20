import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useFetchSuplier } from '../Hooks/useFetchSuplier';
import { useUpdateSupplier } from '../Hooks/useUpdateSuplier';

const STATUS = {
    ACTIVE : 'ACTIVE',
    INACTIVE : 'INACTIVE',
    BLOCKED : 'BLOCKED',
    DELETED : 'DELETED'
};


export default function Component() {
    const navigate = useNavigate()
    const { id } = useParams();

    const { formData, setFormData, initialData, setInitialData , message  } = useFetchSuplier(id);
    const { errors, updateSupplier } = useUpdateSupplier(id, formData, setFormData, initialData, setInitialData);


    const handleSelectChange = ({ target: { name, value } }) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleChange = useCallback((e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }, [formData, setFormData]);
   

    
    

   
   

   

  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour le Fournisseur</h1>
            <p className="text-base text-gray-600">
                Remplissez les informations ci-dessous pour mettre à jour les informations du fournisseur.
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

                        <form onSubmit={updateSupplier} className="space-y-4">


                            <div className="space-y-2">
                                <Label htmlFor="name">Nom Complete :</Label>
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
                                <Label htmlFor="description">Description :</Label>
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
                                    <Label htmlFor="phone">Téléphone :</Label>
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
                                <Label htmlFor="address">Adresse :</Label>
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
                                <Label htmlFor="email">E-mail :</Label>
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
                                    <Label htmlFor="iceNumber">Numéro ICE :</Label>
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
                                    <Label htmlFor="rcNumber">Numéro RC :</Label>
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
            )
        }
    </>
  );
}
