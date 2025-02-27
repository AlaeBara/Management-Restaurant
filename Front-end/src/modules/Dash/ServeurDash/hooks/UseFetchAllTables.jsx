import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchAllTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllTables = useCallback(
    async ({ page = 1, limit = 10, fetchAll = false} = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/tables?select=tableName`;

      try {
        if (fetchAll) {
            const allTables = [];
            let currentPage = page;

            while (true) {
                const response = await axios.get(url, {
                params: { page: currentPage, limit, sort: "createdAt:desc" },
                headers: { Authorization: `Bearer ${token}` },
                });
                
                allTables.push(...response.data.data);

                if (allTables.length >= response.data.total) break;
                currentPage++;
            }

            setTables(allTables);
        } else {
            const response = await axios.get(url, {
                params: { page, limit, sort: "createdAt:desc" },
                headers: { Authorization: `Bearer ${token}` },
            });
            setTables(response.data.data);
        }
      } catch (err) {
        console.error(`Failed to fetch tables: `, err.response?.data?.message || err.message  );
        setError("Une erreur s'est produite lors du chargement des Tables.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { tables ,loading, error, fetchAllTables };
};
