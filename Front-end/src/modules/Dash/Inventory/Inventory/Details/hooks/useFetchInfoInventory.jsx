import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useInfoInventory = (id) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInventory= useCallback(
    async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/inventories/${id}`;

      try {
        const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        });
       
        setInventory(response.data);
        
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
        setError("Une erreur s'est produite lors du chargement des informations du inventaire.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {inventory, loading, error, fetchInventory};
};
