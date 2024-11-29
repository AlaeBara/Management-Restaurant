import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchInfoInventoryAdjustments = (id) => {
  const [inventory, setInventory] = useState([]);
  const [iSloading, setiSloading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchIventoryAdjustments= useCallback(
    async () => {
      setiSloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/inventories/${id}`;

      try {
        const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        });
       
        setInventory(response.data);
      } catch (err) {
        console.error("Failed to fetch inventorys of adjustement:", err);
        setMessage("Une erreur s'est produite lors du chargement l'inventaire .");
      } finally {
        setiSloading(false);
      }
    },
    []
  );

  return { inventory, iSloading, message, fetchIventoryAdjustments };
};
