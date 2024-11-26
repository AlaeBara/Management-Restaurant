import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export function useDeleteProduct(fetchProduct) {
    const deleteProduct = async (id) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Produit supprimée avec succès", {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchProduct();
        } catch (error) {
            console.error('Error deleting product:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return {deleteProduct};
}
