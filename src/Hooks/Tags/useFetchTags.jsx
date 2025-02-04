import { useState, useCallback } from "react";
import axios from "axios";

export const useFetchTags = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/public/menu-items/tags`;

    try {
      const response = await axios.get(url);

      const { data } = response;
      setTags(data);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      setMessage("Une erreur s'est produite lors du chargement des catégories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { tags, isLoading, message, fetchTags };
};