import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const zoneSchema = z.object({
    zoneLabel: z.string()
      .min(1, "Le label de la zone ne peut pas être vide")
      .max(50, "Le label de la zone ne peut pas dépasser 50 caractères"),
    zoneCode: z.string()
      .min(1, "Le code de la zone ne peut pas être vide")
      .max(50, "Le code de la zone ne peut pas dépasser 50 caractères"),
    parentZoneUUID: z.string().optional()
});

export function useUpdateZone(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});

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
      return; // Do nothing if no data is updated
    }

    try {
        zoneSchema.parse(formData);

        const token = Cookies.get('access_token');
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/zones/${id}`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        // On success, set initialData to the current formData
        setInitialData(formData); // Update the initial data to reflect the changes

        setErrors({});
        toast.success('Zone mis à jour avec succès!', {
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
        console.error('Error updating Zone:', error.response?.data?.message || error.message);
        toast.error("Erreur lors de la mise à jour du Zone", {
          icon: '❌',
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateRole };
}
