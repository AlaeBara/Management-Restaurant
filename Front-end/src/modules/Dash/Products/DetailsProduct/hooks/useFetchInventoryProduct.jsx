import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchInventorysProduct = (id) => {
  const [inventorys, setInventorys] = useState([]);
  const [iSloading, setiSloading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchIventory= useCallback(
    async () => {
      setiSloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/inventories`;

      try {
        const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        });
       
        setInventorys(response.data.inventories);
      } catch (err) {
        console.error("Failed to fetch inventorys product:", err);
        setMessage("Une erreur s'est produite lors du chargement des inventaires du produit.");
      } finally {
        setiSloading(false);
      }
    },
    []
  );

  return { inventorys, iSloading, message, fetchIventory };
};
