import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchOneUnits(id) {
    const [formData, setFormData] = useState({
        unit: '',
        baseUnit: null,
        conversionFactorToBaseUnit: null
    });
    const [initialData, setInitialData] = useState({ 
        unit: '',
        baseUnit: null,
        conversionFactorToBaseUnit: null
    }); 

    const [message , setmessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchZone = async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/units/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                unit: response.data.unit,
                baseUnit: response.data.baseUnit,
                conversionFactorToBaseUnit: response.data.conversionFactorToBaseUnit
            });
            setInitialData({
                unit: response.data.unit,
                baseUnit: response.data.baseUnit,
                conversionFactorToBaseUnit: response.data.conversionFactorToBaseUnit
            });
            setLoading(false);
            } catch (error) {
                console.error('Error fetching Unit data:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du Unité")
            }
        };

        fetchZone();
    }, [id]);

    return { formData, setFormData, initialData, setInitialData , message , loading};
}
