import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchChoices = () => {
  const [choices, setChoices] = useState([]);
  const [totalChoices, setTotalChoices] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message, setMessage] = useState(null);
  

  const fetchChoices = useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/choice-attributes?relations=choices`;

      try {
        if (fetchAll) {
          const allChoices = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allChoices.push(...data);

            if (allChoices.length >= total) break;
            currentPage++;
          }

          setChoices(allChoices);
          setTotalChoices(allChoices.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setChoices(data);
          setTotalChoices(total);
        }
      } catch (err) {
        console.error("Failed to fetch choices:", err);
        setMessage("Une erreur s'est produite lors du chargement des Choix.");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { choices, totalChoices, Isloading, message, fetchChoices };
};