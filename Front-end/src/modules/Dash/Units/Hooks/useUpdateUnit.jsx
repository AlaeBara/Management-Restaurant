import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const UnitsSchema = z.object({
    unit: z.string().min(1, { message: "L'unité est obligatoire." }),
    baseUnit: z.string().min(1, { message: "L'unité de base est obligatoire." }),
    conversionFactorToBaseUnit: z.coerce.number({
        required_error: "Le facteur de conversion est obligatoire.",
        invalid_type_error: "Le facteur de conversion est obligatoire.",
    })
      .positive({ message: "Le facteur de conversion doit être un nombre positif." }),
});

export function useUpdateUnit(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});

  // Memoizing the updateRole function with useCallback
  const updateUnit = useCallback(async (e) => {
    e.preventDefault();

    formData.conversionFactorToBaseUnit= parseFloat(formData.conversionFactorToBaseUnit)
    
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
        UnitsSchema.parse(formData);
        const token = Cookies.get('access_token');
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/units/${id}`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        // On success, set initialData to the current formData
        setInitialData(formData); // Update the initial data to reflect the changes

        setErrors({});
        toast.success('Unités Unitésmis à jour avec succès!', {
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
        console.error('Error updating Unit:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message[0] || error.message, {
          icon: '❌',
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateUnit };
}
