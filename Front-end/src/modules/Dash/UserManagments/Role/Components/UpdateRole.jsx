import React, { useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useFetchRole } from '../hooks/useFetchRole';
import { useUpdateRole } from '../hooks/useUpdateRole';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/Spinner/Spinner';

export default function Component() {
    const navigate = useNavigate()
    const { id } = useParams();
    const { formData, setFormData, initialData, setInitialData , message , loading  } = useFetchRole(id);
    const { errors, updateRole } = useUpdateRole(id, formData, setFormData, initialData, setInitialData);
  
    // Memoize handleChange function with useCallback
    const handleChange = useCallback((e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }, [formData, setFormData]);
  
return (
    <>
        <ToastContainer />

        <div className="space-y-2 m-3">
          <h1 className="text-2xl font-bold text-black font-sans">Mettre à jour le rôle</h1>
          <p className="text-base text-gray-600">
            Modifiez les informations ci-dessous pour mettre à jour le rôle dans le système.
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
                            <form onSubmit={updateRole} className="space-y-4">
                                <div className="space-y-2">
                                <Label htmlFor="name">Nom de Rôle</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nom de rôle"
                                />
                                {errors.name && (
                                    <div className="text-xs text-red-500 mt-1">{errors.name}</div>
                                )}
                                </div>
                
                                <div className="space-y-2">
                                <Label htmlFor="label">Description</Label>
                                <textarea
                                    id="label"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}
                                    placeholder="Description du rôle"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    rows="3"
                                />
                                {errors.label && (
                                    <div className="text-xs text-red-500 mt-1">{errors.label}</div>
                                )}
                                </div>

                                <div className='flex gap-4'>
                                    <Button type="submit" onClick={()=>navigate('/dash/Gestion-des-roles')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
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
            )
        }
      </>
    );
}
