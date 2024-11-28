import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useInfoProduct = (id) => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct= useCallback(
    async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`;

      try {
        const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        });
       
        setProduct(response.data);
        
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Une erreur s'est produite lors du chargement des informations du produit.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { product, loading, error, fetchProduct };
};
