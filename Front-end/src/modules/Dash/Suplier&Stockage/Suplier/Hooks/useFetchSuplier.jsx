import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchSuplier(id) {
  const [formData, setFormData] = useState({ 
    name: '', 
    address: '', 
    fax: '', 
    phone: '', 
    email: '', 
    website: '', 
    description: '', 
    status: '', 
    rcNumber: '', 
    iceNumber: '', 
    avatar: '' 
  });
  const [initialData, setInitialData] = useState({ 
    name: '', 
    address: '', 
    fax: '', 
    phone: '', 
    email: '', 
    website: '', 
    description: '', 
    status: '', 
    rcNumber: '', 
    iceNumber: '', 
    avatar: '' 
  });

  const [message , setmessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuplier = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${id}?relations=logo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
            name: response.data.name,
            address: response.data.address,
            fax: response.data.fax  || "",
            phone: response.data.phone  || "",
            email: response.data.email,
            website: response.data.website  || "",
            description: response.data.description || "",
            status: response.data.status,
            rcNumber: response.data.rcNumber,
            iceNumber: response.data.iceNumber,
            avatar: response.data.logo?.fileName  || ""
        });
        setInitialData({
            name: response.data.name,
            address: response.data.address,
            fax: response.data.fax  || "",
            phone: response.data.phone  || "",
            email: response.data.email,
            website: response.data.website  || "",
            description: response.data.description || "",
            status: response.data.status,
            rcNumber: response.data.rcNumber,
            iceNumber: response.data.iceNumber,
            avatar: response.data.logo?.fileName  || ""
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Suplier data:', error.response?.data?.message || error.message);
        setmessage("Erreur lors de la récupération des données du Fournisseur")
      }
    };

    fetchSuplier();
  }, [id]);

  return { formData, setFormData, initialData, setInitialData , message  , loading};
}
