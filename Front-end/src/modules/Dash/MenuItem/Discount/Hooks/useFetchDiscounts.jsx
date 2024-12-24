import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message,  setMessage] = useState(null);

  const fetchDiscounts= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/menu-item-discounts`;

      try {
        if (fetchAll) {
          const allDiscounts = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allDiscounts.push(...data);

            if (allTags.length >= total) break;
            currentPage++;
          }

          setDiscounts(allDiscounts);
          setTotalDiscounts(allDiscounts.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setDiscounts(data);
          setTotalDiscounts(total);
        }
      } catch (err) {
        console.error("Failed to fetch discounts:", err);
        setMessage("Une erreur s'est produite lors du chargement des code promo");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { discounts, totalDiscounts, Isloading, message, fetchDiscounts };
};
