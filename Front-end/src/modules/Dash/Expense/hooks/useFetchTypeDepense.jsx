import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchTypeDepense= () => {
  const [Types, setTypes] = useState([]);
  const [totalTypes, setTotalTypes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTypeDepense = useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/expense-types`;

      try {
        if (fetchAll) {
          const allTypes = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allTypes.push(...data);

            if (allTypes.length >= total) break;
            currentPage++;
          }

          setTypes(allTypes);
          setTotalTypes(allTypes.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setTypes(data);
          setTotalTypes(total);
        }
      } catch (err) {
        console.error("Failed to fetch  type of depense:", err);
        setError("Une erreur s'est produite lors du chargement des type de depense.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { Types, totalTypes, loading, error, fetchTypeDepense };
};
