import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useDeleteZone(fetchZones) {
    const deleteZone = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/zones/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Zone supprimée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchZones();
        } catch (error) {
            console.error('Error deleting zone:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return {deleteZone};
}
