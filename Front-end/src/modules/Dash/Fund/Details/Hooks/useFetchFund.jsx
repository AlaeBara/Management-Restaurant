import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchFund = (id) => {
  const [fund, setFund] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFund= useCallback(
    async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/funds/${id}`;

      try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
       
        setFund(response.data);
        
      } catch (err) {
        console.error("Failed to fetch fund:", err);
        setError("Une erreur s'est produite lors du chargement des informations de la Caisse.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {fund, loading, error, fetchFund};
};
