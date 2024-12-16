import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message,  setMessage] = useState(null);

  const fetchPurchases= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/purchases`;

      try {
        if (fetchAll) {
          const allPurschases = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allPurschases.push(...data);

            if (allPurschases.length >= total) break;
            currentPage++;
          }

          setPurchases(allPurschases);
          setTotalPurchases(allPurschases.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setPurchases(data);
          setTotalPurchases(total);
        }
      } catch (err) {
        console.error("Failed to fetch purchases:", err);
        setMessage("Une erreur s'est produite lors du chargement des Achats");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { purchases, totalPurchases, Isloading, message, fetchPurchases };
};
