import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useDeleteChoice(fetchChoice, currentPage, limit) {

    const deleteChoice = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/choice-attributes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response?.data?.message || "Choice supprimée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchChoice({ page: currentPage, limit: limit });
        } catch (error) {
            console.error('Error deleting Choice:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 7000,
            });
        }
    };

    return { deleteChoice };
}