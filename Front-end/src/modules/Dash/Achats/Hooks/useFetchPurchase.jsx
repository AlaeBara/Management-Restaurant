import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const usePurchase = () => {
  const [purchase, setPurchase] = useState(null); // Changed from `[]` to `null` for clarity when no data is loaded
  const [isLoading, setIsLoading] = useState(false); // Fixed capitalization to follow camelCase conventions
  const [error, setError] = useState(null); // Changed `message` to `error` for consistency

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
        setError("Une erreur s'est produite lors de la création du PDF d'achat.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { purchase, isLoading, error, fetchPurchase };
};
