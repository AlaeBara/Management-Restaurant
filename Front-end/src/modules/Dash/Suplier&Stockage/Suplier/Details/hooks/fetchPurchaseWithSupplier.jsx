import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchPurchasesWithSuppleir = (id) => {
  const [supplierPurchases, setSupplierPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPurchasesWithSuppleir = useCallback(
    async () => {
        setLoading(true);
        setError(null);

        const token = Cookies.get("access_token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/purchases?search.supplierId=${id}`;

        try {
            const response = await axios.get(url, {
                params: {sort: "createdAt:desc" },
                headers: { Authorization: `Bearer ${token}` },
            });
        
            setSupplierPurchases(response.data.data);
            
        } catch (err) {
            console.error("Failed to fetch supplier - purchases with supplier:", err);
            setError("Une erreur s'est produite lors du chargement des achats avec ce fournisseur.");
        } finally {
            setLoading(false);
        }
    },
    [id]
  );

  return {supplierPurchases, loading, error, fetchPurchasesWithSuppleir};
};
