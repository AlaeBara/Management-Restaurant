import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useConfirmTansferOperation(fetchOperation , currentPage, limit) {
    const ConfirmOperation = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/funds-operations/transfer/${id}/approve`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Apprové avec succès.", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchOperation({page: currentPage, limit :limit});
        } catch (error) {
            console.error('Error Approve operation:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return { ConfirmOperation };
}
