import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const StorageSchema = z.object({
    storageCode: z.string({
        required_error: "Le code du stockage est requis.",
    }).min(1, "Le code du stockage ne peut pas être vide."),
    
    storageName: z.string({
        required_error: "Le nom du stockage est requis.",
    }).min(1, "Le nom du stockage ne peut pas être vide."),
    
    subStorageId: z.string().nullable().optional(),
    
    storagePlace: z.string().nullable().optional(),
});

export function  useUpdateStorage(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});

  
  const updateStorage = useCallback(async (e) => {
    e.preventDefault();

    
    const isFormChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

    if (!isFormChanged) {
      toast.info("Aucune modification détectée", {
        icon: 'ℹ️',
        position: "top-right",
        autoClose: 3000,
      });
      return; 
    }

    try {
        StorageSchema.parse(formData);
    
        const token = Cookies.get('access_token');
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/storages/${id}`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setInitialData(formData); 
        setErrors({});
        toast.success('Stock mis à jour avec succès!', {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            console.error('Error updating Storage:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message, {
            icon: '❌',
            position: "top-right",
            autoClose: 3000,
            });
        }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateStorage };
}
