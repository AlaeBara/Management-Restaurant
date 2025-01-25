import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchProduits = () => {
  const [produits, setProduits] = useState([]);
  const [totalProduits, setTotalProduits] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message,  setMessage] = useState(null);

  const fetchProduits= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsImVtYWlsIjoic3VwZXJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsInJvbGVzIjpbInN1cGVyYWRtaW4iXSwicGVybWlzc2lvbnMiOlsiYWNjZXNzLWdyYW50ZWQiXSwiaWF0IjoxNzM3ODI2Njg1LCJleHAiOjE3Mzc5MTMwODV9.3r3_Q9QiBDvxdg71A_cUh02MoDETqYswuf7pddXxVFo";
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/menu-items`;

      try {
        if (fetchAll) {
          const allProduits = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allProduits.push(...data);

            if (allProduits.length >= total) break;
            currentPage++;
          }

          setProduits(allProduits);
          setTotalProduits(allProduits.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setProduits(data);
          setTotalProduits(total);
        }
      } catch (err) {
        console.error("Failed to fetch produits menu:", err);
        setMessage("Une erreur s'est produite lors du chargement des Produits menu");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { produits, totalProduits, Isloading, message, fetchProduits };
};