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

      const token = import.meta.env.VITE_TOKEN
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
        setMessage("Une erreur s'est produite lors du chargement des articles du menu.");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { produits, totalProduits, Isloading, message, fetchProduits };
};