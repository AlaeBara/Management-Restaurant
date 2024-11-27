import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchOneInventory(id) {
    const [formData, setFormData] = useState({
        sku: '',
        warningQuantity: null,
        totalQuantity: null,
        storageId: null,
        productId : null
    });
    const [initialData, setInitialData] = useState({ 
        sku: '',
        warningQuantity: null,
        totalQuantity: null,
        storageId: null,
        productId : null
    }); 

    const [message , setmessage] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchInventory= async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/inventories/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                sku: response.data.sku,
                warningQuantity: response.data.warningQuantity,
                totalQuantity:response.data.totalQuantity,
                storageId: response.data.storageId || null,
                productId : response.data.productId || null
            });
            setInitialData({
                sku: response.data.sku,
                warningQuantity: response.data.warningQuantity,
                totalQuantity:response.data.totalQuantity,
                storageId: response.data.storageId || null,
                productId : response.data.productId || null
            });
            setLoading(false);
            } catch (error) {
                console.error('Error fetching inventory data:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du inventaire")
            }
        };

        fetchInventory();
    }, [id]);

    return { formData, setFormData, initialData, setInitialData , message , loading};
}
