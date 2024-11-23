import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useFetchStorageDeleted = () => {
    const [Storages, setStorages] = useState([]);
    const [totalStorage, setTotalStorage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  const fetchSupliersDeleted = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    const token = Cookies.get('access_token');
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/storages`,
        {
          params: { page, limit, sort: 'createdAt:desc' , onlyDeleted:'true' },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStorages(response.data.data);
      setTotalStorage(response.data.total);
    } catch (error) {
      console.error("Failed to fetch Storage deleted:", error);
      setError("Une erreur s'est produite lors du chargement des Stock Supprimés.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { Storages, totalStorage, loading, error, fetchSupliersDeleted };
};
