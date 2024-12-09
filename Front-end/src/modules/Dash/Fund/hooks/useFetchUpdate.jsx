import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const fundSchema = z.object({
    sku: z.string().min(1, { message: "Le SKU est obligatoire." }),

    name: z.string().min(1, { message: "Le nom du fond de caisse est obligatoire." }),

    type: z
        .string()
        .nonempty({ message: "Le type de la caisse ne peut pas être vide." }),

    isActive: z
        .boolean()
        .nullable()
        .optional(),

    description: z
        .string()
        .nullable()
        .optional()
});

export function useUpdateFund(id, formData, setFormData, initialData, setInitialData) {
    const [errors, setErrors] = useState({});

    // Memoizing the updateFund function with useCallback
    const updateFund = useCallback(async (e) => {
        e.preventDefault();

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
            fundSchema.parse(formData);
            // Remove fields with null or empty string values
            const cleanedFormData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== null && value !== "")
            );

            // Only send modified data (comparing with initialData)
            const modifiedData = Object.keys(cleanedFormData).reduce((acc, key) => {
                if (cleanedFormData[key] !== initialData[key]) {
                    acc[key] = cleanedFormData[key];
                }
                return acc;
            }, {});

            // If no modified fields, return early
            if (Object.keys(modifiedData).length === 0) {
                toast.info("Aucune modification détectée", {
                    icon: 'ℹ️',
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }

          

            const token = Cookies.get('access_token');
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/funds/${id}`, modifiedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // On success, set initialData to the current formData
            setInitialData(formData); // Update the initial data to reflect the changes
            setErrors({});
            toast.success('Caisse mise à jour avec succès!', {
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
                console.error('Error updating fund:', error.response?.data?.message || error.message);
                toast.error(error.response?.data?.message || error.message, {
                    icon: '❌',
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        }
    }, [formData, initialData, id, setFormData, setInitialData]);

    return { errors, updateFund };
}
