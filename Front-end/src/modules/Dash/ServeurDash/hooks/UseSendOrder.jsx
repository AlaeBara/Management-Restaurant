import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useSendOrder = () => {
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    const sendOrder = useCallback(async (orderData) => {
        setLoading(true); 
        setError(null); 

        const token = Cookies.get("access_token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/orders`; 

        try {
            const response = await axios.post(url, orderData, {
                headers: { Authorization: `Bearer ${token}` },
            }); 

            return { response, error: null }; 
        } catch (err) {
            console.error("Failed to send order:", err.response?.data); 
            return { response: null, error: err.response?.data?.message }; 
        } finally {
            setLoading(false); 
        }
    }, []);

    return { loading, error, sendOrder }; 
};