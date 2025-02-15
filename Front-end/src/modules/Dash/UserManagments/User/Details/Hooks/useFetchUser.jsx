import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchUser = (userId) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = Cookies.get("access_token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}?relations=roles`; 

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data); 
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError("Une erreur s'est produite lors du chargement des informations de l'utilisateur.");
    } finally {
      setLoading(false); 
    }
  }, [userId]); 

  return { user, loading, error, fetchUser };
};