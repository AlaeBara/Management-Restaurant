import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useChangeFundSource(fetchOperation, currentPage, limit) {
  const ChangeFundSource = async (formData , CloseModel) => {
    try {
        const token = Cookies.get('access_token');
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/funds-operations/change-fund-source`,
            {
                fundId: formData.fundId,
                operationId: formData.operationId,
            },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        // Show success toast
        toast.success("Caisse modifiée avec succès.", {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });

        // Refresh the operations list
        fetchOperation({ page: currentPage, limit: limit });
        CloseModel();
    } catch (error) {
        console.error('Error changing fund source:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || error.message, {
            icon: '❌',
            position: "top-right",
            autoClose: 3000,
        });
    }
  };

  return { ChangeFundSource };
}