import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useFetchOneProduct(id) {
    const [formData, setFormData] = useState({
        productSKU: '',
        productName: '',
        productDescription: "",
        isOffered: null,
        productType: "",
       unitId: ""
    });
    const [initialData, setInitialData] = useState({ 
        productSKU: '',
        productName: '',
        productDescription: "",
        isOffered: null,
        productType: "",
        unitId: ""
    }); 

    const [message , setmessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data)
            setFormData({
                productSKU: response.data.productSKU,
                productName: response.data.productName,
                productDescription: response.data.productDescription || "",
                isOffered: response.data.isOffered,
                productType: response.data.productType,
                unitId:response.data.unitId || null
            });
            setInitialData({
                productSKU: response.data.productSKU,
                productName: response.data.productName,
                productDescription: response.data.productDescription || "",
                isOffered: response.data.isOffered,
                productType: response.data.productType,
                unitId:response.data.unitId || null
            });
            setLoading(false);
            } catch (error) {
                console.error('Error fetching Product data:', error.response?.data?.message || error.message);
                setmessage("Erreur lors de la récupération des données du produit")
            }
        };

        fetchProduct();
    }, [id]);

    return { formData, setFormData, initialData, setInitialData , message , loading};
}
