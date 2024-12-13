import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UpdateSchema } from '../schemas/UpdateSchema';
import { toast } from 'react-toastify';
import { z } from 'zod';

const useUpdateUser = (id, formData, setFormData, originalData, setOriginalData) => {
  const [errors, setErrors] = useState({});
  const [issLoading, setIssLoading] = useState(false);


  const [alert, setAlert] = useState({ message: null, type: null });

  const updateSubmit = async (e) => {
    e.preventDefault();
    try {
      UpdateSchema.parse(formData);
      const updatedData = {};

      for (const key in formData) {
        if (formData[key] !== originalData[key]) {
          updatedData[key] = formData[key] || null;
        }
      }

      if (Object.keys(updatedData).length === 0) {
        toast.info('Aucune mise à jour nécessaire.', {
          icon: 'ℹ️',
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }


      setIssLoading(true)
      const token = Cookies.get('access_token');

     
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOriginalData({ ...originalData, ...updatedData });
      setErrors({});

      setAlert({
        message: response.data.message,
        type: "success",
      });

      setTimeout(() => {
        setAlert({ message: null, type: null });
      }, 3000);

      setIssLoading(false)

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach(({ path, message }) => {
          fieldErrors[path[0]] = message;
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error updating user:', error);
        setAlert({
          message: error.response?.data?.message,
          type: "error",
        });
        setIssLoading(false)
      }
    }
  };

  return { updateSubmit, errors , alert ,issLoading};
};

export default useUpdateUser;
