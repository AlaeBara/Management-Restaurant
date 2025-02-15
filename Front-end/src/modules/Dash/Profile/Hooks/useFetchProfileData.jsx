import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useProfile = () => {
  const [profile, setProfile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const token = Cookies.get("access_token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(response.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Erreur lors de la récupération des données du profil.");
    } finally {
      setIsLoading(false); 
    }
  }, []);

  return { profile, isLoading, error, fetchProfile };
};