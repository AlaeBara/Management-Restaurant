import React, { useEffect, useState , useCallback } from 'react';
import axios from 'axios';
import style from './AllUser.module.css';
import Cookies from 'js-cookie';
import {SearchX  ,UserRoundCog, Plus , ExternalLink , Ban } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import PaginationNav from './Components/PaginationNav' 


//components
import Spinner from '../../../../components//Spinner/Spinner'
import UserCarts from './Components/UserCarts'
 
const CreateUsers = () => {
    const { user } = useUserContext()

    const navigate = useNavigate()
    

    const [loading, setLoading] = useState(false);
    const [errorgetdate, setErrorgetdate] = useState(null);

    //for get all user
    const [dataUser, setDataUser] = useState([]);
    const [numberOfData, setnumberOfData] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(8); // Items per page

    const totalPages = Math.ceil(numberOfData / limit);

    const fetchUsers = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        const token = Cookies.get('access_token');
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/users?relations=roles`, 
                {
                    params: { page, limit, sort: 'createdAt:desc' },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDataUser(response.data.data);
            setnumberOfData(response.data.total-1);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setErrorgetdate("Une erreur s'est produite lors du chargement des utilisateurs.");
        } finally {
            setLoading(false); 
        }
    }, []);

    
    useEffect(() => {
        fetchUsers(currentPage, limit);
    }, [currentPage, limit, fetchUsers]);

    // Navigate to the next page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    // Navigate to the previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // Calculate item range
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, numberOfData);

    // for show good formation of last lkogin of user
    const formatDate = (lastLogin) => {
        if (!lastLogin) return "introuvable";
        const date = new Date(lastLogin);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };
    
   // delete user
    const deleteUser = async (id) => {
        try {
            const token = Cookies.get('access_token');
         
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/status/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('L’utilisateur a été supprimé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchUsers(currentPage, limit);
        } catch (error) {
            let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
            if (error.response?.data?.message) {
                if (error.response.data.message.includes('User is already deleted')) {
                    errorMessage = "L’utilisateur est déjà supprimé";
                } else if (error.response.data.message.includes('Super admin cannot be deleted')) {
                    errorMessage = "Le super administrateur ne peut pas être supprimé";
                } else {
                    errorMessage = error.response.data.message; 
                }
            }
            console.error('Error delete user:', error.response.data.message);
            toast.error(errorMessage, {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    }


  return (
    <div className={style.container}>
        <ToastContainer />

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Du Personnel</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement tous les membres du personnel de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des membres du personnel, ainsi que gérer leurs rôles et leurs permissions.</p>
            </div>
        </div> 

        

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/Deleted-User')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Employés Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/Add-User')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter un Employé
            </button> 
        </div>

            
        

        {/* Carts Of users */}
        <div>
            {loading ? (
                <div className={style.spinner}>
                <Spinner title="Chargement des utilisateurs..." />
                </div>
            ) : (
                <>
                    {errorgetdate ? (
                        <div className={style.notfound}>
                            <Ban className={style.icon} />
                            <h1>{errorgetdate}</h1>
                        </div>

                    ) : (
                        <>
                        {dataUser.length - 1 > 0 ? (
                            <>
                            
                                <div className={style.userGrid}>
                                    {dataUser
                                    .filter(userData => userData.username !== user.username)
                                    .map(user => (
                                        <UserCarts
                                        key={user.id}
                                        user={user}
                                        formatDate={formatDate}
                                        deleteUser={deleteUser}
                                        />
                                    ))}
                                </div>

                                {/* Navigation */}
                                <PaginationNav
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    startItem={startItem}
                                    endItem={endItem}
                                    numberOfData={numberOfData}
                                    onPreviousPage={handlePreviousPage}
                                    onNextPage={handleNextPage}
                                />
                            </>
                    ) : (
                        // No Users Found Message
                        <div className={style.notfound}>
                            <SearchX className={style.icon} />
                            <h1>Aucun utilisateur trouvé</h1>
                        </div>
                    )}
                </>
            )}
            </>
        )}
        </div>

    </div>
  );
};

export default CreateUsers;
