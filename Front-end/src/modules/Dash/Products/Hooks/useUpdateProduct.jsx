import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const ProductAddSchema = z.object({
    productSKU: z
        .string()
        .max(15, "Le SKU du produit ne doit pas dépasser 15 caractères")
        .nonempty("Le SKU du produit est requis"),
  
    productName: z
        .string()
        .max(75, "Le nom du produit ne doit pas dépasser 75 caractères")
        .nonempty("Le nom du produit est requis"),
        
    productDescription: z
        .string().nullable()
        .optional(),

    isOffered: z.boolean().optional(),
    
    productType: z.string({
        required_error: "Le type de produit est requis.",
        }).min(1, "Le produit type ne peut pas être vide."),

    unitId: z.string().nullable().optional()
});


export function useUpdateProduct(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: null, type: null });

  // Memoizing the updateRole function with useCallback
  const updateProduct = useCallback(async (e) => {
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
        ProductAddSchema.parse(formData);

        const modifiedData = Object.keys(formData).reduce((acc, key) => {
          if (formData[key] !== initialData[key]) {
              acc[key] = formData[key];
          }
          return acc;
        }, {});
        
        const token = Cookies.get('access_token');
        const response =await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, modifiedData, {
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
        toast.success(response.data.message || 'Produit miss à jour avec succès!', {
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
        console.error('Error updating produit:', error.response?.data?.message || error.message);
        setAlert({
          message:
            Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message[0]
              : error.response?.data?.message || "Erreur lors de la mise à jour du Produit",
          type: "error",
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateProduct,alert };
}