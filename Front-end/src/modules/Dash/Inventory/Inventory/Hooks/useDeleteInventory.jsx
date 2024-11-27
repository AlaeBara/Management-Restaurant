import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useDeleteInventory(fetchInventory) {
    const deleteInventory = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/inventories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Inventaires supprimée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchInventory();
        } catch (error) {
            console.error('Error deleting inventory:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return {deleteInventory};
}
