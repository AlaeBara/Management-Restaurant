import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchOrders = (id) => {
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchOrders = useCallback(
        async ({ page = 1, limit = 10, fetchAll = false } = {}) => {
            setIsLoading(true);
            setMessage(null);

            const token = Cookies.get("access_token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/orders`;

            try {
                if (fetchAll) {
                const allOrders = [];
                let currentPage = page;

                while (true) {
                    const response = await axios.get(url, {
                    params: { page: currentPage, limit, sort: "createdAt:desc" },
                    headers: { Authorization: `Bearer ${token}` },
                    });

                    const { data, total } = response.data;
                    allOrders.push(...data);

                    if (allOrders.length >= total) break;
                    currentPage++;
                }

                setOrders(allOrders);
                setTotalOrders(allOrders.length);
                } else {
                const response = await axios.get(url, {
                    params: { page, limit, sort: "createdAt:desc" },
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { data, total } = response.data;
                setOrders(data);
                setTotalOrders(total);
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setMessage("Une erreur s'est produite lors du chargement des commandes");
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return { orders, totalOrders, isLoading, message, fetchOrders };
};