import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchOneFund(id) {
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        type: '',
        isActive : null,
        description: null
    });
    const [initialData, setInitialData] = useState({ 
        sku: '',
        name: '',
        type: '',
        isActive : null,
        description: null
    }); 

    const [message , setmessage] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchFund = async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/funds/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            })
            setFormData({
                sku: response.data.sku,
                name:  response.data.name,
                type:  response.data.type,
                isActive :  response.data.isActive || null,
                description:  response.data.description || null
            });
            setInitialData({
                sku: response.data.sku,
                name:  response.data.name,
                type:  response.data.type,
                isActive :  response.data.isActive || null,
                description:  response.data.description || null
            });
            setLoading(false);
            } catch (error) {
                console.error('Error fetching fund data:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du Caisse")
            }
        };

        fetchFund();
    }, [id]);

    return { formData, setFormData, initialData, setInitialData , message , loading};
}
