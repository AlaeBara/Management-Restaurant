import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Schema for validating the choice
const ChoiceSchema = z.object({
    attribute: z
        .string()
        .min(3, { message: "Le choix doit contenir au moins 3 caractères." })
        .max(30, { message: "Le choix ne doit pas dépasser 30 caractères." }),
});

export function useUpdateChoice(id, formData, setFormData, initialData, setInitialData, CloseModel, fetchChoices) {
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ message: null, type: null });

    const updateChoice = useCallback(async (e) => {
        e.preventDefault();

        // Check if the form data has changed
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
            ChoiceSchema.parse(formData);

            const token = Cookies.get('access_token');
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/choices/attributes/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the initial data and reset errors/alert
            setInitialData(formData);
            setErrors({});
            setAlert({
                message: null,
                type: null,
            });

            // Show success toast
            toast.success(response.data.message || 'Choice mis à jour avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });

            fetchChoices();
            z
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.errors.reduce((acc, { path, message }) => {
                    acc[path[0]] = message;
                    return acc;
                }, {});
                setErrors(fieldErrors);
            } else {
                console.error('Error updating Choice:', error.response?.data?.message || error.message);

                // formData.attribute = initialData.attribute;
                // formData.choices = initialData.choices;
                setAlert({
                    message:
                        Array.isArray(error.response?.data?.message)
                            ? error.response?.data?.message[0]
                            : error.response?.data?.message || "Erreur lors de la mise à jour du Choix.",
                    type: "error",
                });
            }
        }
    }, [formData, initialData, id, setFormData, setInitialData, fetchChoices, CloseModel]);

    // Reset errors and alert
    const resetErrors = () => {
        setAlert({});
        setErrors({});
    };

    return { errors, updateChoice, alert, resetErrors };
}