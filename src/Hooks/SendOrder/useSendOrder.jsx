import { useState, useCallback } from "react";
import axios from "axios";

export const useSendOrder = () => {
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [orderResponse, setOrderResponse] = useState(null); 

    const sendOrder = useCallback(async (orderData) => {
        setLoading(true); 
        setError(null); 

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/orders/public`; 

        try {
            const response = await axios.post(url, orderData); 
            return response.data;
        } catch (err) {
            console.error("Failed to send order:", err.response.data);
            setError(err.response.data.message); 
        } finally {
            setLoading(false); 
        }
    }, []);

    return { loading, error, orderResponse, sendOrder }; 
};