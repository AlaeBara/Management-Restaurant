import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useRestoreFund(fetchFund) {
    const RestoreFund= async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/funds/${id}/restore`, 
                {}, // No request body, so pass an empty object
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Caisse restaurée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchFund();
        } catch (error) {
            console.error('Error restoring fund:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return { RestoreFund };
}
