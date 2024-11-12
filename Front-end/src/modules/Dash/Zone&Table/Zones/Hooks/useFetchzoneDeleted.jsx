import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useFetchZoneDeleted = () => {
  const [zones, setZones] = useState([]);
  const [totalZones, setTotalZones] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchZones = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    const token = Cookies.get('access_token');
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/zones`,
        {
          params: { page, limit, sort: 'createdAt:desc' , onlyDeleted:'true' },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setZones(response.data.data);
      setTotalZones(response.data.total);
    } catch (error) {
      console.error("Failed to fetch zones:", error);
      setError("Une erreur s'est produite lors du chargement des Zones Supprimés.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    zones,
    totalZones,
    loading,
    error,
    fetchZones,
  };
};
