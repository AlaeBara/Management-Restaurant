import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useRestoreZone(fetchZones) {
    const RestoreZone = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/zones/${id}/restore`, 
                {}, // No request body, so pass an empty object
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Zone restaurée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchZones();
        } catch (error) {
            console.error('Error restoring zone:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return { RestoreZone };
}
