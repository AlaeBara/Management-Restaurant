import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchOneTable(id) {
    const [formData, setFormData] = useState({
        zoneUUID: '',
        tableName: '',
        tableCode: '',
        isActive: null,
        tableStatus: '',
    });
    const [initialData, setInitialData] = useState({
        zoneUUID: '',
        tableName: '',
        tableCode: '',
        isActive: null,
        tableStatus: '',
    });

    const [message , setmessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTable = async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tables/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                zoneUUID: response.data.zoneId,
                tableName: response.data.tableName,
                tableCode: response.data.tableCode,
                isActive: response.data.isActive,
                tableStatus: response.data.tableStatus,
            });
            setInitialData({
                zoneUUID: response.data.zoneId,
                tableName: response.data.tableName,
                tableCode: response.data.tableCode,
                isActive: response.data.isActive,
                tableStatus: response.data.tableStatus,
            });
            setLoading(false);
            } catch (error) {
                console.error('Error fetching table  data:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du Table")
            }
        };

        fetchTable();
    }, [id]);

    return { formData, setFormData, initialData, setInitialData , message , loading};
}
