import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchOperationTransfert = () => {
  const [transferts, setTransferts] = useState([]);
  const [totalTransferts, setTotalTransferts] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message,  setMessage] = useState(null);

  const fetchTransfertOperation= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/funds-operations?search.operationType=transfer`;

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

          setTransferts(allOperation);
          setTotalTransferts(allOperation.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setTransferts(data);
          setTotalTransferts(total);
        }
      } catch (err) {
        console.error("Failed to fetch operations - transfert:", err);
        setMessage("Une erreur s'est produite lors du chargement des Transferts Opérations");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return {transferts, totalTransferts, Isloading, message,  fetchTransfertOperation};
};
