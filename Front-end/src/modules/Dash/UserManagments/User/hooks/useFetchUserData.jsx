import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const useFetchUserData = (id) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
    gender: '',
    address: '',
    phone: '',
    roleId: null,
    status: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [messageError , setMessageError]= useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        const [userResponse, rolesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setOriginalData((prevData) => ({
          ...prevData,
          firstname: userResponse.data.firstname,
          lastname: userResponse.data.lastname,
          username: userResponse.data.username,
          address: userResponse.data.address || '',
          password: userResponse.data.password,
          phone: userResponse.data.phone || '',
          gender: userResponse.data.gender,
          email: userResponse.data.email,
          roleId: userResponse.data.roleIds?.[0] || null,
          status: userResponse.data.status
        }));
        setFormData((prevData) => ({
          ...prevData,
          firstname: userResponse.data.firstname,
          lastname: userResponse.data.lastname,
          username: userResponse.data.username,
          address: userResponse.data.address || '',
          password: userResponse.data.password,
          phone: userResponse.data.phone || '',
          gender: userResponse.data.gender,
          email: userResponse.data.email,
          roleId: userResponse.data.roleIds?.[0] || null,
          status: userResponse.data.status
        }));
        
        

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessageError("Échec de la récupération des données.")
        toast.error("Échec de la récupération des données.", {
          icon: '❌',
          position: 'top-right',
          autoClose: 3000,
        });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { formData, setFormData, originalData,  isLoading, setOriginalData , messageError };
};

export default useFetchUserData;
