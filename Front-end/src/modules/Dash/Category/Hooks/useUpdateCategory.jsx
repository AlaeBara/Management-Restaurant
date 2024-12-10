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

  isTimeRestricted: z
    .boolean()
    .optional(),


  activeTimeStart: z
    .string()
    .optional()
    .nullable()
    .refine((val) => {
        if (val === null || val === undefined) return true;
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
    }, { message: "L'heure de début doit être au format HH:mm." }),


  activeTimeEnd: z
    .string()
    .optional()
    .nullable()
    .refine((val) => {
        if (val === null || val === undefined) return true;
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
    }, { message: "L'heure de début doit être au format HH:mm." }),


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
  const [alert, setAlert] = useState({ message: null, type: null });

  const validateCategoryForm = (formData) => {
    const errors = {};

    // Validate time-related fields only when time restriction is enabled
    if (formData.isTimeRestricted) {
        // Validate start time
        if (!formData.activeTimeStart || formData.activeTimeStart.trim() === '') {
            errors.activeTimeStart = "L'heure de début est requise lorsque les restrictions temporelles sont activées.";
        } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.activeTimeStart)) {
            errors.activeTimeStart = "L'heure de début doit être au format HH:mm.";
        }

        // Validate end time
        if (!formData.activeTimeEnd || formData.activeTimeEnd.trim() === '') {
            errors.activeTimeEnd = "L'heure de fin est requise lorsque les restrictions temporelles sont activées.";
        } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.activeTimeEnd)) {
            errors.activeTimeEnd = "L'heure de fin doit être au format HH:mm.";
        }

        // Validate active days
        if (!formData.activeDays || formData.activeDays.length === 0) {
            errors.activeDays = "Les jours actifs sont requis lorsque les restrictions temporelles sont activées.";
        } else {
            const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const invalidDays = formData.activeDays.filter(day => !validDays.includes(day));
            
            if (invalidDays.length > 0) {
                errors.activeDays = "Les jours actifs doivent être des jours de la semaine valides.";
            }
        }
    }

    return errors;
  };

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

        const timeValidationErrors = validateCategoryForm(formData);

        // If there are any time-related validation errors
        if (Object.keys(timeValidationErrors).length > 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                ...timeValidationErrors
            }));
            return;
        }
        CategorieAddSchema.parse(formData);

        const modifiedData = Object.keys(formData).reduce((acc, key) => {
          if (formData[key] !== initialData[key]) {
              acc[key] = formData[key];
          }
          return acc;
        }, {});
        const token = Cookies.get('access_token');
        const response =await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, modifiedData , {
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
        toast.success(response.data.message || 'Catégorie miss à jour avec succès!', {
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
        setAlert({
          message:
            Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message[0]
              : error.response?.data?.message || "Erreur lors de la mise à jour du Catégorie",
          type: "error",
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateCategory,alert };
}
