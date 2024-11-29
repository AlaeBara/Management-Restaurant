import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchAdjustemetByInventory = (id) => {
  const [inventorysMovements, setIventoryMovements] = useState([]);
  const [totalIventoryMovement, setTotalIventoryMovement] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message,  setMessage] = useState(null);

  const fetchIventoryMovement= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/inventories-movements/by-inventory/${id}`;

      try {
        if (fetchAll) {
          const allIventory = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allIventory.push(...data);

            if (allIventory.length >= total) break;
            currentPage++;
          }

          setIventoryMovements(allIventory);
          setTotalIventoryMovement(allIventory.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setIventoryMovements(data);
          setTotalIventoryMovement(total);
        }
      } catch (err) {
        console.error("Failed to fetch iventorys movements:", err);
        setMessage("Une erreur s'est produite lors du chargement des inventaires movements.");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { inventorysMovements, totalIventoryMovement, Isloading, message, fetchIventoryMovement };
};
