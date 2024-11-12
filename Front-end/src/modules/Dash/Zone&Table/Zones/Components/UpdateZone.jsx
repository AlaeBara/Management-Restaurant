import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import {useFetchOneZone} from "../Hooks/useFetchOneZone"
import {useUpdateZone} from '../Hooks/useUpdateZone'


export default function Component() {
    const {id} =useParams()
    const navigate = useNavigate()
   
    //fetch date of zone 
    const { formData, setFormData, initialData, setInitialData , message  } = useFetchOneZone(id);

    const { errors, updateRole } = useUpdateZone(id, formData, setFormData, initialData, setInitialData);

    const handleChange = useCallback((e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }, [formData, setFormData]);


  return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour le Zone</h1>
            <p className="text-base text-gray-600">
                Modifiez les informations ci-dessous pour mettre à jour le Zone dans le système.
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
                        <form onSubmit={updateRole} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Label de la Zone</Label>
                                <Input
                                    id="zoneLabel"
                                    name="zoneLabel"  // Fixed name attribute
                                    value={formData.zoneLabel}
                                    onChange={handleChange}
                                    placeholder="Label de la Zone"
                                />
                                {errors.zoneLabel && (
                                    <p className="text-xs text-red-500 mt-1">{errors.zoneLabel}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="label">Code de la Zone</Label>
                                <Input
                                    id="zoneCode"
                                    name="zoneCode"  
                                    value={formData.zoneCode}
                                    onChange={handleChange}
                                    placeholder="Code de la Zone"
                                />
                                {errors.zoneCode && (
                                    <p className="text-xs text-red-500 mt-1">{errors.zoneCode}</p>
                                )}
                            </div>

                            <div className='flex gap-4'>

                                <Button type="submit" onClick={()=>navigate('/dash/zones')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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
