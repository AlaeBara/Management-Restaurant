import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchUnitsDeleted = () => {
  const [units, setUnits] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUnits = useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/units?onlyDeleted=true`;

      try {
        if (fetchAll) {
          const allZones = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allZones.push(...data);

            if (allZones.length >= total) break;
            currentPage++;
          }

          setUnits(allZones);
          setTotalUnits(allZones.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setUnits(data);
          setTotalUnits(total);
        }
      } catch (err) {
        console.error("Failed to fetch units:", err);
        setError("Une erreur s'est produite lors du chargement des unités.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { units, totalUnits, loading, error, fetchUnits };
};
