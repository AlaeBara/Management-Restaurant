import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchInventorysProduct = () => {
  const [inventorys, setInventorys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchAllInventories = useCallback(async (id) => {
    setIsLoading(true);
    setMessage(null);
    const token = Cookies.get("access_token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/inventories`;

    let allInventories = [];
    let hasMore = true;
    let page = 1;

    try {
      while (hasMore) {
        const response = await axios.get(url, {
          params: { page, limit: 10, sort: "createdAt:desc" },
          headers: { Authorization: `Bearer ${token}` },
        });

        allInventories = [...allInventories, ...response.data.inventories];
        hasMore = response.data.inventories.length === 10; // If less than 10 items, no more data
        page += 1;
      }

      setInventorys(allInventories);
    } catch (err) {
      console.error("Failed to fetch inventories product:", err);
      setMessage("Une erreur s'est produite lors du chargement des inventaires du produit.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { inventorys, isLoading, message, fetchAllInventories };
};
