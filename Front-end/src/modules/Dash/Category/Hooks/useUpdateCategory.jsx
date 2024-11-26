import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const CategorieAddSchema = z.object({
    categoryName: z
        .string()
        .nonempty({ message: "Le nom de la catégorie ne peut pas être vide." })
        .max(50, { message: "Le nom de la catégorie ne peut pas dépasser 50 caractères." }),

    categoryCode: z
        .string()
        .nonempty({ message: "Le code de la catégorie ne peut pas être vide." })
        .max(15, { message: "Le code de la catégorie ne peut pas dépasser 15 caractères." }),

    categoryDescription: z.string().nullable().optional(),

    parentCategoryId: z
        .string()
        .nullable()
        .optional(),

    isTimeRestricted: z.boolean({
        required_error: "L'indicateur de restriction temporelle est obligatoire.",
        invalid_type_error: "L'indicateur de restriction temporelle est obligatoire.",
    }),

    activeTimeStart: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "L'heure de début doit être au format HH:mm." }),

    activeTimeEnd: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "L'heure de fin doit être au format HH:mm." }),

    activeDays: z
        .array(z.string())
        .optional()
        .refine(
            (days) => days.every((day) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)),
            {
                message: "Les jours actifs doivent être des jours de la semaine valides.",
            }
        )
});


export function useUpdateCategory(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});

  // Memoizing the updateRole function with useCallback
  const updateCategory= useCallback(async (e) => {
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
        CategorieAddSchema.parse(formData);
        console.log(formData)
        const token = Cookies.get('access_token');
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        // On success, set initialData to the current formData
        setInitialData(formData); // Update the initial data to reflect the changes


        setErrors({});
        toast.success('Catégorie miss à jour avec succès!', {
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
        console.error('Error updating categorie:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || error.message, {
          icon: '❌',
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateCategory };
}
