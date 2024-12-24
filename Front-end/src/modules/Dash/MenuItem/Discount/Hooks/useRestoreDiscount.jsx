import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useRestoreDiscount(fetchDiscountDeleted ,currentPage, limit) {
    const RestoreDiscount = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/menu-item-discounts/${id}/restore`, 
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(response?.data?.message || "Promo restaurée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchDiscountDeleted({page: currentPage, limit :limit});
        } catch (error) {
            console.error('Error restoring discount:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 7000,
            });
        }
    };

    return { RestoreDiscount };
}
