import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const token = Cookies.get('access_token');
    
    try {
      let allRoles = [];
      let page = 1;
      let limit = 10;
      let totalRoles = 0;

      // Fetch the first page to get the total number of roles
      const firstResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/roles`,
        {
          params: { page, limit, sort: 'createdAt:desc' },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      totalRoles = firstResponse.data.total;
      allRoles = [...firstResponse.data.data];

      // Calculate how many pages we need to fetch
      const totalPages = Math.ceil(totalRoles / limit);

      // Fetch remaining pages if any
      for (let i = 2; i <= totalPages; i++) {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/roles`,
          {
            params: { page: i, limit, sort: 'createdAt:desc' },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        allRoles = [...allRoles, ...response.data.data];
      }

      setRoles(allRoles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setError("Une erreur s'est produite lors du chargement des rôles.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles
  };
};
