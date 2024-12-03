import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchFundsDeleted = () => {
  const [funds, setFunds] = useState([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFunds = useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/funds?onlyDeleted=true`;

      try {
        if (fetchAll) {
          const allFunds = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allFunds.push(...data);

            if (allFunds.length >= total) break;
            currentPage++;
          }

          setFunds(allFunds);
          setTotalFunds(allFunds.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setFunds(data);
          setTotalFunds(total);
        }
      } catch (err) {
        console.error("Failed to fetch  funds:", err);
        setError("Une erreur s'est produite lors du chargement des caisses.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { funds, totalFunds, loading, error, fetchFunds };
};
