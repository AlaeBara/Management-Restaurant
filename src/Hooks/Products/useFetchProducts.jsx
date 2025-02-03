import { useState, useCallback } from "react";
import axios from "axios";

export const useFetchProduits = () => {
  const [produits, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchProduits = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/public/menu-items`;

    try {
      const response = await axios.get(url);
      const { data } = response;

      setProduits(data);
    } catch (err) {
      console.error("Failed to fetch produits menu:", err);
      setMessage("Une erreur s'est produite lors du chargement des articles du menu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { produits,  isLoading, message, fetchProduits};
};