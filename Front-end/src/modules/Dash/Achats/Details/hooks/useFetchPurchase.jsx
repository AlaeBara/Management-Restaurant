import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const usePurchase = () => {
  const [purchase, setPurchase] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null);

  const fetchPurchase = useCallback(
    async (id) => {
      setIsLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/purchases/${id}`;

      try {
        const response = await axios.get(url, {
          params: { sort: "createdAt:desc" },
          headers: { Authorization: `Bearer ${token}` },
        });

        setPurchase(response.data);
      } catch (err) {
        console.error("Failed to fetch purchase:", err);
        setError("Erreur lors de la récupération des données du l'achat.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { purchase, isLoading, error, fetchPurchase };
};
