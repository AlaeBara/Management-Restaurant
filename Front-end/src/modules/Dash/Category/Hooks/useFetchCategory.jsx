import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchCategory = () => {
  const [categories, setCategories] = useState([]);
  const [totalCategorie, setTotalCategorie] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategorie= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/categories`;

      try {
        if (fetchAll) {
          const allCategorie = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allCategorie.push(...data);

            if (allCategorie.length >= total) break;
            currentPage++;
          }

          setCategories(allCategorie);
          setTotalCategorie(allCategorie.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setCategories(data);
          setTotalCategorie(total);
        }
      } catch (err) {
        console.error("Failed to fetch Categorie:", err);
        setError("Une erreur s'est produite lors du chargement des Categories.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { categories, totalCategorie, loading, error, fetchCategorie };
};
