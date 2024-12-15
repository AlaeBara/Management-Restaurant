import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchProduct = () => {
  const [products, setProduct] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

      try {
        if (fetchAll) {
          const allProduct = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allProduct.push(...data);

            if (allProduct.length >= total) break;
            currentPage++;
          }

          setProduct(allProduct);
          setTotalProduct(allProduct.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setProduct(data);
          setTotalProduct(total);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Une erreur s'est produite lors du chargement des Produits.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { products, totalProduct, loading, error, fetchProduct };
};
