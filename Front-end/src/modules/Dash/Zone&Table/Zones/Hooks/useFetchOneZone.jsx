import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchOneZone(id) {
    const [formData, setFormData] = useState({ zoneLabel: '', zoneCode: '' });
    const [initialData, setInitialData] = useState({ zoneLabel: '',zoneCode: '' }); 

    const [message , setmessage] = useState(null);


    useEffect(() => {
        const fetchZone = async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/zones/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
    
            setFormData({
                zoneLabel: response.data.zoneLabel,
                zoneCode: response.data.zoneCode,
            });
            setInitialData({
                zoneLabel: response.data.zoneLabel,
                zoneCode: response.data.zoneCode,
            });
            } catch (error) {
                console.error('Error fetching role data:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du zone")
            }
        };

        fetchZone();
    }, [id]);

    return { formData, setFormData, initialData, setInitialData , message };
}
