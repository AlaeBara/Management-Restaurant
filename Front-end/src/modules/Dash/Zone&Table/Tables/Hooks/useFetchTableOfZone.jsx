import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchTableOfZone = () => {
  const [tables, setTables] = useState([]);
  const [totalTables, setTotalTables] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTableOfZone = useCallback(
    async ({ page = 1, limit = 10, fetchAll = false , id } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/zones/${id}/tables`;

      try {
        if (fetchAll) {
          const allTables = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });
            
            const { data, total } = response.data;
            allTables.push(...response.data.data);

            if (allTables.length >= total) break;
            currentPage++;
          }

          setTables(allTables);
          setTotalTables(allTables.length);

        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });
          setTables(response.data.data);
          setTotalTables(response.data.total);
        }
      } catch (err) {
        console.error(`Failed to fetch table of zone  ${id} : `, err.response?.data?.message || err.message  );
        setError("Une erreur s'est produite lors du chargement des Tables.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { tables, totalTables, loading, error, fetchTableOfZone };
};
