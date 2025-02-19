import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useGetOneChoice() {
    const [message, setMessage] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [choiceData, setChoiceData] = useState(null);

    const fetchOneChoice = useCallback(async (id) => {
        setLoading(true);
        setMessage(null);

        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/choice-attributes/${id}?relations=choices`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setChoiceData(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching choice data:', error.response?.data?.message || error.message);
            setMessage("Erreur lors de la récupération des données du choix");
            return null; 
        } finally {
            setLoading(false);
        }
    }, []);

    return { choiceData, message, loading, fetchOneChoice };
}