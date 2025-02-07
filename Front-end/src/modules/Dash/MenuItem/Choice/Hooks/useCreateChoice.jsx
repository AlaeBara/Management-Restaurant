import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { z } from 'zod';

const ChoiceSchema = z.object({
    attribute: z
        .string()
        .min(3, { message: "Le choix doit contenir au moins 3 caractères." })
        .max(30, { message: "Le choix ne doit pas dépasser 30 caractères." }),
});


export const useCreateChoice = (formData, CloseModel , fetchChoices) => {
  const [issLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: null });
  const [errors, setErrors] = useState({});

  const fetchCreateChoice = useCallback(async () => {
    setIsLoading(true);
    setErrors({});
    setAlert({ message: null, type: null });

    const token = Cookies.get("access_token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/choices/attributes`;

    try {
        console.log(formData)
        ChoiceSchema.parse(formData);

        const response = await axios.post(url, formData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(response.data.message || 'Choix crèe avec succès!', {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });
        CloseModel()
        setErrors({})
        fetchChoices()
    } catch (err) {
        if (err instanceof z.ZodError) {
            const fieldErrors = err.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            console.error("Failed to create choice-attributes:", err.response?.data?.message || err.message);
            setAlert({
                message: err.response?.data?.message || err.message || "Erreur lors creation de Choix.",
                type: 'error',
            });
        }
    } finally {
      setIsLoading(false);
    }
  }, [formData]);


  const resetErrors = () => {setAlert({}) ; setErrors({})};

  return { issLoading, alert, errors,  fetchCreateChoice , resetErrors};
};
