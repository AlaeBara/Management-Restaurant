import React, { useEffect, useState } from 'react';
import style from './SuppliersDeleted.module.css'
import { useNavigate } from 'react-router-dom'
import {Ban, SearchX} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/Spinner/Spinner';
import { useFetchSupliersDeleted  } from '../Hooks/useFetchSuppliersDeleted';
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import  SupplierDeletedCard  from '../Components/CartDeletedSupplier'
import axios from 'axios';
import Cookies from 'js-cookie';


const Supliers = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { Supliers, totalSupliers, loading, error, fetchSupliersDeleted} = useFetchSupliersDeleted()

    //pagination
    const totalPages = Math.ceil(totalSupliers / limit);
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
    const endItem = Math.min(currentPage * limit, totalSupliers);
  
    
    useEffect(() => {
        fetchSupliersDeleted(currentPage, limit);
    }, [currentPage, limit,  fetchSupliersDeleted]);


    
    // Restore user function
    const restoreSuppliers = async (id) => {
        const token = Cookies.get('access_token');
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${id}/restore`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchSupliersDeleted();
            toast.success("Fournisseur restauré avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error(error.response);
            toast.error(error.response.data.message || "Erreur lors de la restauration du Fournisseur.", {
                position: "top-right",
                autoClose: 7000,
            });
        }
    };


  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Fournisseurs Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des fournisseurs supprimés de votre plateforme. Vous pouvez voir les détails des fournisseurs qui ont été retirés du système et, si nécessaire, les restaurer.</p>
            </div>
        </div>



        {/* carts of zone */}
        <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Fournisseurs Supprimés..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {Supliers.length > 0 ? (
                    <>

                        <div className={style.userGrid}>
                        {Supliers.map(suplier => (
                            <SupplierDeletedCard  key={suplier.id} supplier={suplier} RESTORE={restoreSuppliers}  />
                        ))}
                        </div>

                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalSupliers}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Fournisseurs Supprimés trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div> 

    </div>
  )
}

export default Supliers