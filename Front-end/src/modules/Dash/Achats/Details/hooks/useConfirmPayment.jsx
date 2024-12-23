import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useConfirmPayment(fetchOperation ,idd) {
    const ConfirmPayment = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/purchases/paiements/${id}/confirm`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Paiement validé avec succès.", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchOperation(idd);
        } catch (error) {
            console.error('Error Approve payment:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 7000,
            });
        }
    };

    return { ConfirmPayment };
}
