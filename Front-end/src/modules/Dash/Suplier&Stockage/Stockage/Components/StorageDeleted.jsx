import React, { useEffect, useState } from 'react';
import style from '../Storage.module.css'
import {Ban,SearchX} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchStorageDeleted} from '../Hooks/useFetchDeleteStorage'
import axios from 'axios';
import Cookies from 'js-cookie';
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import CartStorageDeleted  from './CartStorageDeleted'
import Spinner from '../../../../../components/Spinner/Spinner'


const Storage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { Storages, totalStorage, loading, error, fetchSupliersDeleted } = useFetchStorageDeleted()

    //pagination
    const totalPages = Math.ceil(totalStorage / limit);
    const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
    };
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalStorage);
  
    useEffect(() => {
        fetchSupliersDeleted({ page: currentPage , limit :limit  });
    }, [currentPage, limit, fetchSupliersDeleted]);


    // Restore Stock
    const restoreStorage = async (id) => {
        const token = Cookies.get('access_token');
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/storages/${id}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchSupliersDeleted();
            toast.success("Stock restauré avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Placement De Stock Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des stocks supprimés de votre plateforme. Vous pouvez visualiser les articles qui ont été retirés du système.</p>
            </div>
        </div>

        <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Stockage Supprimés..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {Storages.length > 0 ? (
                    <>
                        <div className={style.userGrid}>
                        {Storages.map(Storage => (
                            <CartStorageDeleted key={Storage.id} Storage={Storage}  RESTORE={restoreStorage} />
                        ))}
                        </div>

                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalStorage}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Stock Supprimés Trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div> 

    </div>
  )
}

export default Storage