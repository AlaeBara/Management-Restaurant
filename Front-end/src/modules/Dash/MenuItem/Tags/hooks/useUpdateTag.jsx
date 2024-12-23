import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';


const TagSchema = z.object({
    tag: z
        .string()
        .min(3, { message: "Le tag doit contenir au moins 3 caractères." })
        .max(30, { message: "Le tag ne doit pas dépasser 30 caractères." }),
});

export function useUpdateTag(id, formData, setFormData, initialData, setInitialData ,CloseModel,fetchTags) {
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: null, type: null });


  const updateTag = useCallback(async (e) => {
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
        TagSchema .parse(formData);
        const token = Cookies.get('access_token');
        console.log(formData)
        const response =await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/menu-item-tags/${id}`, formData, {
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
        toast.success(response.data.message || 'Tag mis à jour avec succès!', {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });
        fetchTags()
        CloseModel()

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, { path, message }) => {
          acc[path[0]] = message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        console.error('Error updating Unit:', error.response?.data?.message || error.message);
        setAlert({
          message:
            Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message[0]
              : error.response?.data?.message || "Erreur lors de la mise à jour du Tag",
          type: "error",
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  const resetErrors = () => {setAlert({}) ; setErrors({})};

  return { errors, updateTag ,alert,resetErrors };
}
