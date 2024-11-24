import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useGetInfoZone(id) {
    const [message , setmessage] = useState(null);
    const [isloading, setisLoading] = useState(true);
    const [info , setInfo] = useState([])

    useEffect(() => {
        const fetchZone = async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/zones/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setInfo(response.data)
            setisLoading(false)
            } catch (error) {
                console.error('Error fetching info of zone:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du zone")
            }
        };

        fetchZone();
    }, [id]);

    return {info, message , isloading};
}
