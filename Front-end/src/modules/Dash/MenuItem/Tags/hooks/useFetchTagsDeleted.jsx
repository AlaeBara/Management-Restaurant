import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchTagsDeleted = () => {
  const [tags, setTags] = useState([]);
  const [totalTags, setTotalTags] = useState(0);
  const [Isloading, setIsloading] = useState(false);
  const [message,  setMessage] = useState(null);

  const fetchTags= useCallback(
    async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
      setIsloading(true);
      setMessage(null);

      const token = Cookies.get("access_token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/menu-item-tags?onlyDeleted=true`;

      try {
        if (fetchAll) {
          const allTags = [];
          let currentPage = page;

          while (true) {
            const response = await axios.get(url, {
              params: { page: currentPage, limit, sort: "createdAt:desc" },
              headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = response.data;
            allTags.push(...data);

            if (allTags.length >= total) break;
            currentPage++;
          }

          setTags(allTags);
          setTotalTags(allTags.length);
        } else {
          const response = await axios.get(url, {
            params: { page, limit, sort: "createdAt:desc" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, total } = response.data;
          setTags(data);
          setTotalTags(total);
        }
      } catch (err) {
        console.error("Failed to fetch tags:", err);
        setMessage("Une erreur s'est produite lors du chargement des Tags");
      } finally {
        setIsloading(false);
      }
    },
    []
  );

  return { tags, totalTags, Isloading, message, fetchTags };
};
