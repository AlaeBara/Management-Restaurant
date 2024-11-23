import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchStorage(id) {
  const [formData, setFormData] = useState({  
    storageCode: '',
    storageName: '',
    parentStorageId: null,
  });
  const [initialData, setInitialData] = useState({ 
    storageCode: '',
    storageName: '',
    parentStorageId: null,
  }); 
  

  const [message , setmessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/storages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setFormData({
          storageCode: response.data.storageCode,
          storageName: response.data.storageName,
          parentStorageId: response.data.parentStorageId || null,
        });
        setInitialData({
          storageCode: response.data.storageCode,
          storageName: response.data.storageName,
          parentStorageId: response.data.parentStorageId || null,
        });
        setLoading(false)
      } catch (error) {
        console.error('Error fetching Stock data:', error.response?.data?.message || error.message);
        setmessage("Erreur lors de la récupération des données du Stock")
      }
    };

    fetchStorage();
  }, [id]);

  return { formData, setFormData, initialData, setInitialData , message , loading };
}
