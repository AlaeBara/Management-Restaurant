import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useInfoSupplier = (id) => {
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInfoSupplier= useCallback(
    async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${id}?relations=logo`;

      try {
        const response = await axios.get(url, {
        params: {sort: "createdAt:desc" },
        headers: { Authorization: `Bearer ${token}` },
        });
       
        setSupplier(response.data);
        
      } catch (err) {
        console.error("Failed to fetch supplier:", err);
        setError("Une erreur s'est produite lors du chargement des informations du Fournisseur.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {supplier, loading, error, fetchInfoSupplier};
};
