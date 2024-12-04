import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchExpense = (id) => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message,  setMessage] = useState(null);

  const fetchExpense= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/funds-operations?search.operation=expense`;

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

          setExpenses(allOperation);
          setTotalExpenses(allOperation.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setExpenses(data);
          setTotalExpenses(total);
        }
      } catch (err) {
        console.error("Failed to fetch operations - expense:", err);
        setMessage("Une erreur s'est produite lors du chargement des dépenses");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { expenses, totalExpenses, Isloading, message, fetchExpense};
};
