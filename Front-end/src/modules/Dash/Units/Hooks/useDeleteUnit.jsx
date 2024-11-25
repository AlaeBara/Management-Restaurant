import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useDeleteUnit(fetchUnits) {
    const deleteUnit = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/units/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Unités supprimée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchUnits();
        } catch (error) {
            console.error('Error deleting Unit:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return {deleteUnit};
}
