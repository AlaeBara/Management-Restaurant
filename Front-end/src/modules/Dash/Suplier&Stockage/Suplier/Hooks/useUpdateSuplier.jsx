import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const SuplierSchema = z.object({
  name: z.string().min(1, "Le nom du fournisseur ne peut pas être vide"),
  address: z.string().min(1, "L'adresse du fournisseur ne peut pas être vide"),
  fax: z.string().nullable().optional(),
  phone:z.string()
      .min(1, "Le numéro de téléphone du fournisseur ne peut pas être vide")
      .refine(value => value === null || /^[+]?[0-9\s]*$/.test(value), {
          message: 'Numéro de téléphone invalide.',
      }),
  email: z.string().email("Format d'email invalide").nullable().optional(),
  website: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  rcNumber: z.string().min(1, "Le numéro RC du fournisseur ne peut pas être vide"),
  iceNumber: z.string().min(1, "Le numéro ICE du fournisseur ne peut pas être vide"),
});

export function useUpdateSupplier(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: null, type: null });


  // Memoizing the updateRole function with useCallback
  const updateSupplier = useCallback(async (e) => {
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
      SuplierSchema.parse(formData);

      const modifiedData = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] !== initialData[key]) {
            acc[key] = formData[key];
        }
        return acc;
      }, {});
      const token = Cookies.get('access_token');
      const response =await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${id}`, modifiedData, {
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
      toast.success(response.data.message || 'Fournisseur mis à jour avec succès!', {
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
        console.error('Error updating supplier:', error.response?.data?.message || error.message);
        setAlert({
          message:
            Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message[0]
              : error.response?.data?.message || "Erreur lors de la mise à jour du fournisseur",
          type: "error",
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateSupplier,alert };
}
