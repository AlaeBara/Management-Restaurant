import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { z } from 'zod';

const PaymentSchema = z.object({
    amount: z.coerce.number({
        required_error: "Le montant est obligatoire",
        invalid_type_error: "Le montant doit être un nombre valide",
    })
    .positive({ message: "Le montant doit être un nombre positif" }),
    status: z.string().nullable().optional(),
    reference: z.string().nullable().optional(),
    atePaiement: z.string().nullable().optional(),
});

export const useCreatePayment = (id,formData, CloseModel) => {
  const [issLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: null });
  const [errors, setErrors] = useState({});

  const fetchCreatePayment = useCallback(async () => {
    setIsLoading(true);
    setErrors({});
    setAlert({ message: null, type: null });

    const token = Cookies.get("access_token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/purchases/${id}/paiements`;

    try {
     
        PaymentSchema.parse(formData);

        const preparedData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== null && value !== '')
        );
      
        preparedData.amount = parseFloat(preparedData.amount);

        console.log(preparedData)
       
        const response = await axios.post(url, preparedData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(response.data.message || 'Paiement crèe avec succès!', {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });
        CloseModel()
        setErrors({})
    } catch (err) {
        if (err instanceof z.ZodError) {
            const fieldErrors = err.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
        } else {
            console.error("Failed to create payment:", err.response?.data?.message );
            setAlert({
                message: err.response?.data?.message || "Erreur lors creation de paiement.",
                type: 'error',
            });
        }
    } finally {
      setIsLoading(false);
    }
  }, [id, formData]);


  const resetErrors = () => {setAlert({})};

  return { issLoading, alert, errors,  fetchCreatePayment , resetErrors};
};
