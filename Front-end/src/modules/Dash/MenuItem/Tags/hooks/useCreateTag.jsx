import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { z } from 'zod';

const TagSchema = z.object({
    tag: z
        .string()
        .min(3, { message: "Le tag doit contenir au moins 3 caractères." })
        .max(30, { message: "Le tag ne doit pas dépasser 30 caractères." }),
});


export const useCreateTag = (formData, CloseModel , fetchTags) => {
  const [issLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: null });
  const [errors, setErrors] = useState({});

  const fetchCreateTag = useCallback(async () => {
    setIsLoading(true);
    setErrors({});
    setAlert({ message: null, type: null });

    const token = Cookies.get("access_token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/menu-item-tags`;

    try {
        TagSchema.parse(formData);

        const response = await axios.post(url, formData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(response.data.message || 'Tag crèe avec succès!', {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });
        CloseModel()
        setErrors({})
        fetchTags()
    } catch (err) {
        if (err instanceof z.ZodError) {
            const fieldErrors = err.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            console.error("Failed to create tag:", err.response?.data?.message || err.message);
            setAlert({
                message: err.response?.data?.message || err.message || "Erreur lors creation de tag.",
                type: 'error',
            });
        }
    } finally {
      setIsLoading(false);
    }
  }, [formData]);


  const resetErrors = () => {setAlert({}) ; setErrors({})};

  return { issLoading, alert, errors,  fetchCreateTag , resetErrors};
};
