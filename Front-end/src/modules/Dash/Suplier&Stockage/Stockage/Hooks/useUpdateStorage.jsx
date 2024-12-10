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
    
    parentStorageId: z.string().nullable().optional(),
    
});

export function  useUpdateStorage(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});

  const [alert, setAlert] = useState({ message: null, type: null });

  
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
        const modifiedData = Object.keys(formData).reduce((acc, key) => {
            if (formData[key] !== initialData[key]) {
                acc[key] = formData[key];
            }
            return acc;
        }, {});
        const token = Cookies.get('access_token');
        const response =await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/storages/${id}`, modifiedData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setInitialData(formData); 
        setErrors({});
        setAlert({
            message: null,
            type: null
        });
        toast.success(response.data.message || 'Stock mis à jour avec succès!', {
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
            setAlert({
                message:
                  Array.isArray(error.response?.data?.message)
                    ? error.response?.data?.message[0]
                    : error.response?.data?.message || "Erreur lors de la mise à jour du Stock",
                type: "error",
              });
        }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateStorage ,alert};
}
