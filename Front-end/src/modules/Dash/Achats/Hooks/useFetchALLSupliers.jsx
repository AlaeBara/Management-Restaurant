import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchSupliers = () => {
    const [Supliers, setSupliers] = useState([]);
    const [totalSupliers, setTotalSupliers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  const  fetchSupliers= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url =  `${import.meta.env.VITE_BACKEND_URL}/api/suppliers`;

      try {
        if (fetchAll) {
          const allSupliers = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allSupliers.push(...data);

            if (allSupliers.length >= total) break;
            currentPage++; 
          }
          setSupliers(allSupliers);
          setTotalSupliers(allSupliers.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setSupliers(data);
          setTotalSupliers(total);
        }
      } catch (err) {
        console.error("Failed to fetch Supliers:", error);
        setError("Une erreur s'est produite lors du chargement des  Fournisseurs.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { Supliers, totalSupliers, loading, error, fetchSupliers};
};
