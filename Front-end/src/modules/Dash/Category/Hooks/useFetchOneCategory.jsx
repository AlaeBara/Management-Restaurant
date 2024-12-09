import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchOneCategory(id) {
    const [formData, setFormData] = useState({
        categoryName: '',
        categoryCode: '',
        categoryDescription: "",
        parentCategoryId: null,
        isTimeRestricted: false,
        activeTimeStart: null,
        activeTimeEnd: null,
        activeDays: [],
    });
    const [initialData, setInitialData] = useState({ 
        categoryName: '',
        categoryCode: '',
        categoryDescription: "",
        parentCategoryId: null,
        isTimeRestricted: false,
        activeTimeStart: null,
        activeTimeEnd: null,
        activeDays: [],
    }); 

    const [message , setmessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const parseTime = (timeString) => {
        if (!timeString) return null; // Handle null or undefined input
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };
      

    useEffect(() => {
        const fetchCategory = async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            
            setFormData({
                categoryName: response.data.categoryName,
                categoryCode: response.data.categoryCode,
                categoryDescription: response.data.categoryDescription,
                parentCategoryId: response.data.parentCategoryId || "",
                isTimeRestricted: response.data.isTimeRestricted,
                activeTimeStart:  parseTime(response.data.activeTimeStart ),
                activeTimeEnd: parseTime(response.data.activeTimeEnd),
                activeDays: response.data.activeDays || []
            });
            setInitialData({
                categoryName: response.data.categoryName,
                categoryCode: response.data.categoryCode,
                categoryDescription: response.data.categoryDescription,
                parentCategoryId: response.data.parentCategoryId || "",
                isTimeRestricted: response.data.isTimeRestricted,
                activeTimeStart:  parseTime(response.data.activeTimeStart) ,
                activeTimeEnd: parseTime(response.data.activeTimeEnd),
                activeDays: response.data.activeDays || []
            });
            setLoading(false);
            } catch (error) {
                console.error('Error fetching category data:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du Catégorie")
            }
        };

        fetchCategory();
    }, [id]);

    return { formData, setFormData, initialData, setInitialData , message , loading};
}
