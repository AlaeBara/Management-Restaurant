import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchIventory = () => {
  const [inventorys, setIventory] = useState([]);
  const [totalIventory, setTotalIventory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIventory= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/inventories`;

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

          setIventory(allIventory);
          setTotalIventory(allIventory.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setIventory(data);
          setTotalIventory(total);
        }
      } catch (err) {
        console.error("Failed to fetch iventorys:", err);
        setError("Une erreur s'est produite lors du chargement des inventaires.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { inventorys, totalIventory, loading, error, fetchIventory };
};
