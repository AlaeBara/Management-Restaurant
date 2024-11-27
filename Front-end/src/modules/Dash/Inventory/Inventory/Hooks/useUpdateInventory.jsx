import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const InventorySchema = z.object({
    sku: z.string().min(1, { message: "Le SKU  est obligatoire." }),
    
    warningQuantity: z.coerce.number({
        required_error: "La quantité d'alerte est obligatoire.",
        invalid_type_error: "La quantité d'alerte est obligatoire.",
    })
      .positive({ message: "Le facteur de conversion doit être un nombre positif." }),

    
    totalQuantity: z.coerce.number({
        required_error: "La quantité totla est obligatoire.",
        invalid_type_error: "La quantité total est obligatoire.",
    })
      .positive({ message: "Le facteur de conversion doit être un nombre positif." }),

    storageId: z
        .string()
        .nullable()
        .optional(),

    productId: z
        .string()
        .nullable()
        .optional(),
    
});

export function useUpdateInventory(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});

  // Memoizing the updateRole function with useCallback
  const updateInventory = useCallback(async (e) => {
    e.preventDefault();

    formData.warningQuantity = parseFloat(formData.warningQuantity)
    formData.totalQuantity = parseFloat(formData.totalQuantity)
    
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
        InventorySchema .parse(formData);
        const token = Cookies.get('access_token');
        console.log("new data" ,formData )
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/inventories/${id}`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        // On success, set initialData to the current formData
        setInitialData(formData); // Update the initial data to reflect the changes

        setErrors({});
        toast.success('Inventaire mis à jour avec succès!', {
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
        toast.error(error.response?.data?.message || error.message, {
          icon: '❌',
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateInventory };
}
