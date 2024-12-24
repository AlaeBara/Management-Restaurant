import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

const DiscountSchema = z.object({
    discountSku: z
        .string()
        .min(3, { message: "Le code SKU de la réduction doit comporter au moins 3 caractères." })
        .max(15, { message: "Le code SKU de la réduction ne peut pas dépasser 15 caractères." })
        .nonempty({ message: "Le code SKU de la réduction est obligatoire." }),


    discountType: z
        .string()
        .nonempty({ message: "Le type de réduction est obligatoire." }),

    discountValue: z.coerce
        .number({
            required_error: "La valeur de la réduction est obligatoire.",
            invalid_type_error: "La valeur de la réduction doit être un nombre.",
        })
        .nonnegative({ message: "La valeur de la réduction doit être un nombre positif." }),

    isActive:z.boolean().optional(),

    startDateTime: z
        .string()
        .nullable()
        .optional(),

    endDateTime: z
        .string()
        .nullable()
        .optional(),
});


export function useUpdateDiscounts(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: null, type: null });

  // Memoizing the updateRole function with useCallback
  const updateDiscounts = useCallback(async (e) => {
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
        DiscountSchema.parse(formData);
        formData.discountValue = parseFloat(formData.discountValue)
        
        const modifiedData = Object.keys(formData).reduce((acc, key) => {
          if (formData[key] !== initialData[key]) {
              acc[key] = formData[key];
          }
          return acc;
        }, {});

        const token = Cookies.get('access_token');
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/menu-item-discounts/${id}`, modifiedData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        // On success, set initialData to the current formData
        setInitialData(formData); // Update the initial data to reflect the changes

        setErrors({});
        setAlert({
          message: null,
          type: null
        });
        toast.success(response.data.message || 'Code promo mis à jour avec succès!', {
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
        console.error('Error updating inventory:', error.response?.data?.message || error.message);
        setAlert({
          message:
            Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message[0]
              : error.response?.data?.message || "Erreur lors de la mise à jour du code promo",
          type: "error",
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateDiscounts ,alert};
}
