import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchLangages = () => {
  const [langages, setLangages] = useState([]);
  const [totaLangages, setTotalLangages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLangage= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/languages`;

      try {
        if (fetchAll) {
          const allLangages = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allLangages.push(...data);

            if (allLangages.length >= total) break;
            currentPage++;
          }

          setLangages(allLangages);
          setTotalLangages(allLangages.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setLangages(data);
          setTotalLangages(total);
        }
      } catch (err) {
        console.error("Failed to fetch langages:", err);
        setError("Une erreur s'est produite lors du chargement des Language.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { langages, totaLangages, loading, error, fetchLangage };
};
