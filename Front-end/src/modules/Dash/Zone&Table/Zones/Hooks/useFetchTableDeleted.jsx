import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useFetchZoneDeleted = (id) => {
    const [tables, setTables] = useState([]);
    const [totalTables, setTotalTables] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  const fetchTableDeleted = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    const token = Cookies.get('access_token');
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/zones/${id}/tables`,
        {
          params: { page, limit, sort: 'createdAt:desc' , onlyDeleted:'true' },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTables(response.data.data);
      setTotalTables(response.data.total);
    } catch (error) {
      console.error("Failed to fetch Table deleted:", error);
      setError("Une erreur s'est produite lors du chargement les Tables Supprimés.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tables,
    totalTables,
    loading,
    error,
    fetchTableDeleted,
  };
};
