import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchPurchasesOfSuppler = (id) => {
  const [supplierPurchases, setSupplierPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSupplierPurchases = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${id}/purchases`;

      try {
        const response = await axios.get(url, {
            params: {sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
        });
       
        setSupplierPurchases(response.data);
        
      } catch (err) {
        console.error("Failed to fetch supplier - purchases:", err);
        setError("Une erreur s'est produite lors du chargement des informations du Fournisseur - Achats.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {supplierPurchases, loading, error, fetchSupplierPurchases};
};
