import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useRestoreChoice(fetchDeletedChoices, currentPage, limit) {
    const restoreChoice = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/choice-attributes/${id}/restore`, 
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Choice restauré avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchDeletedChoices({ page: currentPage, limit: limit });
        } catch (error) {
            console.error('Error restoring choice:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 7000,
            });
        }
    };

    return { restoreChoice };
}