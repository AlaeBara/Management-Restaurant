import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useFetchSupliersDeleted = () => {
  const [Supliers, setSupliers] = useState([]);
  const [totalSupliers, setTotalSupliers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSupliersDeleted = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    const token = Cookies.get('access_token');
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/suppliers`,
        {
          params: { page, limit, sort: 'createdAt:desc' , onlyDeleted:'true' },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSupliers(response.data.data);
      setTotalSupliers(response.data.total);
    } catch (error) {
      console.error("Failed to fetch Supliers deleted:", error);
      setError("Une erreur s'est produite lors du chargement des Fournisseurs Supprimés.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    Supliers,
    totalSupliers,
    loading,
    error,
    fetchSupliersDeleted,
  };
};