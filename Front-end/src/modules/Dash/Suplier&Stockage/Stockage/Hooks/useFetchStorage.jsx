import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchStorage = () => {
  const [Storages, setStorages] = useState([]);
  const [totalStorage, setTotalStorage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStorage = useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/storages`;

      try {
        if (fetchAll) {
          const allStorages = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allStorages.push(...data);

            if (allStorages.length >= total) break; // Stop when all data is fetched
            currentPage++;
          }

          setStorages(allStorages);
          setTotalStorage(allStorages.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setStorages(data);
          setTotalStorage(total);
        }
      } catch (err) {
        console.error("Failed to fetch Storage:", err);
        setError("Une erreur s'est produite lors du chargement des Stock.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { Storages, totalStorage, loading, error, fetchStorage };
};
