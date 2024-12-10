import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const roleSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères").max(20, "Le nom ne peut pas dépasser 20 caractères"),
  label: z.string().optional(),
});

export function useUpdateRole(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: null, type: null });

  // Memoizing the updateRole function with useCallback
  const updateRole = useCallback(async (e) => {
    e.preventDefault();

    // Check if formData is the same as initialData (meaning no change)
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
      roleSchema.parse(formData);
      

      const token = Cookies.get('access_token');
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInitialData(formData);

      setErrors({});
      toast.success('Rôle mis à jour avec succès!', {
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
        console.error('Error updating role:', error.response?.data?.message || error.message);
        setAlert({
          message:
            Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message[0]
              : error.response?.data?.message || "Erreur lors de la mise à jour du rôle!",
          type: "error",
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateRole };
}
