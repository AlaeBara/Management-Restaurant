import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useRolesDeleted = () => {
  const [roles, setRoles] = useState([]);
  const [totalRoles, setTotalRoles] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    const token = Cookies.get('access_token');
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/roles`,
        {
          params: { page, limit, sort: 'createdAt:desc', onlyDeleted:'true' },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setRoles(response.data.data);
      setTotalRoles(response.data.total);
    } catch (error) {
      console.error("Failed to fetch roles Deleted:", error);
      setError("Une erreur s'est produite lors du chargement des Rôles Supprimés .");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    roles,
    totalRoles,
    loading,
    error,
    fetchRoles
  };
};