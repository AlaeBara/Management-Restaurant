import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useStartShift(fetchZone) {
    const StartShift = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/shift-zone/start-shift-by-waiter`, 
                {zoneId :id},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Prise de service assignée avec succès à vous dans une zone.", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchZone()
        } catch (error) {
            console.error('Error Start Shift:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return { StartShift };
}
