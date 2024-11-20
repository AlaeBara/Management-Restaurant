import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useDeleteSupplier(fetchSupliers) {
    const deleteSupplier = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Fournisseur supprimée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchSupliers();
        } catch (error) {
            console.error('Error deleting supplier:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return {deleteSupplier};
}
