import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchZone = () => {
  const [zones, setZones] = useState([]);
  const [totalZones, setTotalZones] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchZones = useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/zones`;

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

          setZones(allZones);
          setTotalZones(allZones.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setZones(data);
          setTotalZones(total);
        }
      } catch (err) {
        console.error("Failed to fetch zones:", err);
        setError("Une erreur s'est produite lors du chargement des zones.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { zones, totalZones, loading, error, fetchZones };
};
