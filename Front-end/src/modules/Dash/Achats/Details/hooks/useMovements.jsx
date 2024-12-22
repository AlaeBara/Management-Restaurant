import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { z } from 'zod';

const MoveSchema = z.object({
    quantityToMove: z.string().nonempty({ message: 'La quantité à déplacer est requise.' }),
    quantityToReturn: z.string().nullable().optional(),
});

export const useMovements = (id, formData, CloseModel ,fetchData,idd ) => {
  const [issLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: null });
  const [errors, setErrors] = useState({});

  const fetchMovements = useCallback(async () => {
    setIsLoading(true);
    setErrors({});
    setAlert({ message: null, type: null });

    const token = Cookies.get("access_token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/purchases/items/${id}/execute-movement`;

    try {
     
        MoveSchema.parse(formData);

        const preparedData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== null && value !== '')
        );
      
         
        preparedData.quantityToMove = parseFloat(preparedData.quantityToMove);
        if (preparedData.quantityToReturn) {
            const parsedQuantity = parseFloat(preparedData.quantityToReturn);
            if (!isNaN(parsedQuantity)) {
                preparedData.quantityToReturn = parsedQuantity;
            }
        }
        

        const response = await axios.post(url, preparedData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(response.data.message || 'Mouvement effectué avec succès!', {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });
        CloseModel()
        setErrors({})
        fetchData(idd)
    } catch (err) {
        if (err instanceof z.ZodError) {
            const fieldErrors = err.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            console.error("Failed to execute a purchase movement:", err.response?.data?.message);
            setAlert({
                message: err.response?.data?.message || "Erreur lors du mouvement.",
                type: 'error',
            });
        }
    } finally {
      setIsLoading(false);
    }
  }, [id, formData]);

    const resetErrors = () => {
        setAlert({ message: null, type: null });
        setErrors({}); // Reset errors state
    };

  return { issLoading, alert, errors, fetchMovements,resetErrors };
};
