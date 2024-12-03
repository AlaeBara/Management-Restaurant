import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useGetOperationFund = (id) => {
  const [operations, setOperations] = useState([]);
  const [totalOperations, setTotalOperations] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message,  setMessage] = useState(null);

  const fetchOperation= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/funds/${id}/operations`;

      try {
        if (fetchAll) {
          const allOperation = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allOperation.push(...data);

            if (allOperation.length >= total) break;
            currentPage++;
          }

          setOperations(allOperation);
          setTotalOperations(allOperation.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setOperations(data);
          setTotalOperations(total);
        }
      } catch (err) {
        console.error("Failed to fetch operation:", err);
        setMessage("Une erreur s'est produite lors du chargement des operations de la caisse.");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { operations, totalOperations, Isloading, message, fetchOperation };
};
