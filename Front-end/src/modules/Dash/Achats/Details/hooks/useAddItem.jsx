import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { z } from 'zod';

const AddItemSchema = z.object({
    productId: z.string({ 
        required_error: "Le produit est obligatoire" 
    }).min(1, { message: "Veuillez sélectionner un produit" }),
    
    inventoryId: z.string({ 
        required_error: "L'inventaire est obligatoire" 
    }).min(1, { message: "Veuillez sélectionner un inventaire" }),
    
    quantity: z.coerce.number({
        required_error: "La quantité est obligatoire",
        invalid_type_error: "La quantité est obligatoire",
    })
    .positive({ message: "La quantité doit être un nombre positif" }),
    
    unitPrice: z.coerce.number({
        required_error: "Le prix unitaire est obligatoire",
        invalid_type_error: "Le prix unitaire est obligatoire",
    })
    .positive({ message: "Le prix unitaire doit être un nombre positif" }),
    
    totalAmount: z.coerce.number({
        required_error: "Le montant total est obligatoire",
        invalid_type_error: "Le montant total est obligatoire",
    })
    .positive({ message: "Le montant total doit être un nombre positif ou zéro" }),
});

export const useAddItem= (id, formData2, CloseModelCreation , fetchData) => {
  const [isssLoading, setIsssLoading] = useState(false);
  const [alertt, setAlert] = useState({ message: null, type: null });
  const [errorss, setErrors] = useState({});

  const fetchAddItem = useCallback(async () => {
    setIsssLoading(true);
    setErrors({});
    setAlert({ message: null, type: null });

    const token = Cookies.get("access_token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/purchases/items/${id}`;

    try {
     
        AddItemSchema.parse(formData2);

        const response = await axios.post(url, formData2, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(formData2)

        toast.success(response.data.message || "Produit ajouté avec succès à l'achat!", {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });
        fetchData(id)
        CloseModelCreation()
        setErrors({})
    } catch (err) {
        if (err instanceof z.ZodError) {
            const fieldErrors = err.errors.reduce((acc, { path, message }) => {
            acc[path[0]] = message;
            return acc;
            }, {});
            setErrors(fieldErrors);
            console.log(fieldErrors)
        } else {
            console.error("Failed to add item:", err.response?.data?.message);
            setAlert({
                message: err.response?.data?.message || "Erreur lors du ajouté Produit à l'achat .",
                type: 'error',
            });
        }
    } finally {
      setIsssLoading(false);
    }
  }, [id, formData2]);

    const resetErrorss = () => {
        setAlert({ message: null, type: null });
        setErrors({}); // Reset errors state
    };

  return { isssLoading, alertt, errorss, fetchAddItem, resetErrorss };
};
