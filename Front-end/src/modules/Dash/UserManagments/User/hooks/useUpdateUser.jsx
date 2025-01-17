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

      // Step 1: Check for changes and create updatedData object
      const updatedData = {};
      for (const key in formData) {
        if (formData[key] !== originalData[key]) {
          updatedData[key] = formData[key] || null;
        }
      }

      // If no changes, show a message and return
      if (Object.keys(updatedData).length === 0) {
        toast.info('Aucune mise à jour nécessaire.', {
          icon: 'ℹ️',
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }

      // Step 2: Create FormData object at the last step
      const formDataToSend = new FormData();

      for (const key in updatedData) {
        if (key === 'avatar') {
          if (formData[key] === '') {
            // If avatar is an empty string, set a flag to remove the avatar
            formDataToSend.append('setAvatarAsNull', true);
          } else if (formData[key] instanceof File) {
            // If avatar is a file, append it to FormData
            formDataToSend.append('avatar', formData[key]);
          }
        } else {
          // Append other fields
          formDataToSend.append(key, updatedData[key]);
        }
      }

      // Debugging: Log FormData contents
      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Step 3: Send the FormData to the backend
      setIssLoading(true);
      const token = Cookies.get('access_token');

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', 
          },
        }
      );

      setOriginalData({ ...originalData, ...formData });
      setErrors({});

      // Show success message
      toast.success(response.data.message || 'Employé modifié avec succès!', {
        icon: '✅',
        position: 'top-right',
        autoClose: 1500,
      });

      setIssLoading(false);
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
          type: 'error',
        });
        setIssLoading(false);
      }
    }
  };

  return { updateSubmit, errors, alert, issLoading };
};

export default useUpdateUser;