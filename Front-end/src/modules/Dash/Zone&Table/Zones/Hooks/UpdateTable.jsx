import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Cookies from 'js-cookie';

// Zod schema for form validation
const TableSchema = z.object({
    tableName: z.string().nonempty("Le nom de la table est requis"),
    tableCode: z.string().nonempty("Le code de la table est requis"),
    isActive: z.boolean().optional(),
    tableStatus: z.string().optional(),
});

export function useUpdateTable(id, formData, setFormData, initialData, setInitialData) {
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: null, type: null });

  // Memoizing the updateRole function with useCallback
  const updateTable = useCallback(async (e) => {
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
        TableSchema.parse(formData);

        const modifiedData = Object.keys(formData).reduce((acc, key) => {
          if (formData[key] !== initialData[key]) {
              acc[key] = formData[key];
          }
          return acc;
        }, {});

        console.log(modifiedData)

        const token = Cookies.get('access_token');
        const response =await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/tables/${id}`, modifiedData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        // On success, set initialData to the current formData
        setInitialData(formData); 

        setErrors({});
        setAlert({
          message: null,
          type: null
        });
        toast.success(response.data.message || 'Table mise à jour avec succès!', {
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
        console.error('Error updating table:', error.response?.data?.message || error.message);
        setAlert({
          message:
            Array.isArray(error.response?.data?.message)
              ? error.response?.data?.message[0]
              : error.response?.data?.message || "Erreur lors de la mise à jour du Table",
          type: "error",
        });
      }
    }
  }, [formData, initialData, id, setFormData, setInitialData]);

  return { errors, updateTable,alert };
}
