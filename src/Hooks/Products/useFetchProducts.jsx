import { useState, useCallback } from "react";
import axios from "axios";

export const useFetchProduits = () => {
  const [produits, setProduits] = useState([]);
  const [laoding_Produits, setLaoding_Produits] = useState(false);
  const [msg_Prouits, setMsg_Prouits] = useState(null);

  const fetchProduits = useCallback(async () => {
    setLaoding_Produits(true);
    setMsg_Prouits(null);

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/public/menu-items`;

    try {
      const response = await axios.get(url);
      const { data } = response;

      setProduits(data);
    } catch (err) {
      console.error("Failed to fetch produits menu:", err);
      setMsg_Prouits("Une erreur s'est produite lors du chargement des articles du menu.");
    } finally {
      setLaoding_Produits(false);
    }
  }, []);

  return { produits,  laoding_Produits, msg_Prouits, fetchProduits};
};