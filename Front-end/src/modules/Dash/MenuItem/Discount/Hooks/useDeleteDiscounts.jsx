import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useDeleteDiscount(fetcheDiscount,currentPage , limit) {

    const deleteDiscount = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/menu-item-discounts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response?.data?.message || "Code Promo supprimée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetcheDiscount({page: currentPage, limit :limit});
        } catch (error) {
            console.error('Error deleting discount:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 7000,
            });
        }
    };

    return {deleteDiscount};
}
