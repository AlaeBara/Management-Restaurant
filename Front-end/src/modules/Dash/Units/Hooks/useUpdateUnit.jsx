import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const UnitsSchema = z.object({
  unit: z.string().nonempty({ message: "L'unité est obligatoire." }),
  baseUnit: z
      .string()
      .nullable()
      .optional(),
  conversionFactorToBaseUnit: z
      .number()
      .nullable()
      .optional(),
  
});

export function useUpdateUnit(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: null, type: null });

  // Memoizing the updateRole function with useCallback
  const updateUnit = useCallback(async (e) => {
    e.preventDefault();

    if (formData.conversionFactorToBaseUnit !== null && formData.conversionFactorToBaseUnit !== '') {
      formData.conversionFactorToBaseUnit = parseFloat(formData.conversionFactorToBaseUnit);
    } else {
        formData.conversionFactorToBaseUnit = null;
    }
  
    
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
        const modifiedData = Object.keys(formData).reduce((acc, key) => {
          if (formData[key] !== initialData[key]) {
              acc[key] = formData[key];
          }
          return acc;
        }, {});
        console.log(modifiedData)
        const response =await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/units/${id}`, modifiedData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setInitialData(formData); // Update the initial data to reflect the changes
        setErrors({});
        setAlert({
          message: null,
          type: null
        });
        toast.success(response.data.message || 'Unité mis à jour avec succès!', {
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
        setAlert({
          message:
            Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message[0]
              : error.response?.data?.message || "Erreur lors de la mise à jour du Unité",
          type: "error",
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateUnit ,alert};
}
