import { useState, useCallback } from "react";
import axios from "axios";

export const useFetchProduitsByTag = () => {
  const [produitsByTag, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchProduitsByTag = useCallback(async (id) => {
    setIsLoading(true);
    setMessage(null);

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/public/menu-items/tag/${id}`;

    try {
      const response = await axios.get(url);
      const { data } = response;

      setProduits(data);
    } catch (err) {
      console.error("Failed to fetch produits menu by tag:", err);
      setMessage("Une erreur s'est produite lors du chargement des articles du menu de cette catégorie.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { produitsByTag,  isLoading, message, fetchProduitsByTag};
};