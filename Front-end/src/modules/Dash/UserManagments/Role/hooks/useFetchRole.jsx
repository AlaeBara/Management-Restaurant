import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchRole(id) {
  const [formData, setFormData] = useState({ name: '', label: '' });
  const [initialData, setInitialData] = useState({ name: '', label: '' }); 

  const [message , setmessage] = useState(null);


  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          name: response.data.name,
          label: response.data.label,
        });
        setInitialData({
          name: response.data.name,
          label: response.data.label,
        });
      } catch (error) {
        console.error('Error fetching role data:', error.response?.data?.message || error.message);
        setmessage("Erreur lors de la récupération des données du rôle")
      }
    };

    fetchRole();
  }, [id]);

  return { formData, setFormData, initialData, setInitialData , message };
}
