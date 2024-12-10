import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import style from './AllUser.module.css';
import Cookies from 'js-cookie';
import { SearchX} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../../components/Spinner/Spinner';
import PaginationNav from './Components/PaginationNav'; 
import UserDeletedCarts  from './Components/UserDeletedCarts'

const DeletedUsers = () => {
    const [dataUser, setDataUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10; // Number of items per page
    const [numberOfDate, setnumberOfData] = useState(0);

    // Fetch users function with useCallback
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users?onlyDeleted=true&limit=${limit}&page=${currentPage}&relations=roles`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataUser(response.data.data);
            setnumberOfData(response.data.total);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch (error) {
            console.error(error.response?.data?.message || "Erreur de récupération des utilisateurs supprimés");
            toast.error("Erreur lors de la récupération des utilisateurs supprimés.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    }, [currentPage]); // Dependency on currentPage

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Restore user function
    const restoreUser = async (id) => {
        const token = Cookies.get('access_token');
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/status/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchUsers(currentPage, limit);
            toast.success("Utilisateur restauré avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error(error.response);
            toast.error("Erreur lors de la restauration de l'utilisateur.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleMenuClick = (userId, e) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === userId ? null : userId);
    };

    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handler for page navigation
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className={style.container}>
            <ToastContainer />
            <div className={style.Headerpage}>
                <h1 className={style.title}>Historique Des Utilisateurs Supprimés</h1>
            </div>

            {loading ? (
                <div className={style.spinnerContainer}>
                    <Spinner title="Chargement des utilisateurs supprimés..." />
                </div>
            ) : (
                <>
                    {dataUser.length > 0 ? (
                        <div>
                            <div className={style.userGrid}>
                                {dataUser.map((user) => (
                                    <UserDeletedCarts key={user.id}  user={user} restore={restoreUser}/> 
                                ))}
                            </div>

                            {/* Pagination Component */}
                            <PaginationNav
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startItem={(currentPage - 1) * limit + 1}
                                endItem={Math.min(currentPage * limit, numberOfDate)}
                                numberOfData={numberOfDate}
                                onPreviousPage={handlePreviousPage}
                                onNextPage={handleNextPage}
                            />
                        </div>
                    ) : (
                        <div className={style.notfound}>
                            <SearchX className={style.icon} />
                            <h1>Aucun utilisateur supprimé trouvé</h1>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DeletedUsers;
