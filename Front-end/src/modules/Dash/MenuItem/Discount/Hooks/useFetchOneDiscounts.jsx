import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { formatDate } from '@/components/dateUtils/dateUtils';

export function useFetchOneDiscounts(id) {
    const [formData, setFormData] = useState({
        discountSku: '',
        discountType: '',
        discountValue:null,
        isActive : true,
        startDateTime:'',
        endDateTime:'',
    });
    const [initialData, setInitialData] = useState({ 
        discountSku: '',
        discountType: '',
        discountValue:null,
        isActive : true,
        startDateTime:'',
        endDateTime:'',
    }); 

    const [message , setmessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscounts= async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/menu-item-discounts/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                discountSku: response.data.discountSku,
                discountType: response.data.discountType,
                discountValue: response.data.discountValue,
                isActive : response.data.isActive,
                startDateTime:  response.data.startDateTime ? formatDate(response.data.startDateTime) : '',
                endDateTime: response.data.endDateTime ? formatDate(response.data.endDateTime) : '',
            });
            setInitialData({
                discountSku: response.data.discountSku,
                discountType: response.data.discountType,
                discountValue: response.data.discountValue,
                isActive : response.data.isActive,
                startDateTime: response.data.startDateTime ? formatDate(response.data.startDateTime) : '',
                endDateTime: response.data.endDateTime ? formatDate(response.data.endDateTime) : '',
            });  
            setLoading(false);
            } catch (error) {
                console.error('Error fetching discounts data:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du code promo")
            }
        };

        fetchDiscounts();
    }, [id]);

    return { formData, setFormData, initialData, setInitialData , message , loading};
}
