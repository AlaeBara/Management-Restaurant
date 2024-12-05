import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useEndShift(fetchZone) {
    const EndShift = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/shift-zone/end-shift-by-waiter`, 
                {zoneId :id},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Fin de service enregistrée avec succès.", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchZone();
        } catch (error) {
            console.error('Error end Shift:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return { EndShift };
}
