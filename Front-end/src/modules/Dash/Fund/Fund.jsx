import React, { useEffect, useState } from 'react';
import style from './Fund.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchFunds} from './hooks/useFetchFunds'
import CartFund from './Components/CartFund'
import {useDeleteFund} from './hooks/useDeleteFund'


const Funds= () => {
    const  navigate = useNavigate()

    const { funds, totalFunds, loading, error, fetchFunds } = useFetchFunds()
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    //pagination
    const totalPages = Math.ceil(totalFunds / limit);
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
    const endItem = Math.min(currentPage * limit, totalFunds);
   
    useEffect(() => {
        fetchFunds({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchFunds]);

    const {deleteFund}= useDeleteFund(fetchFunds)



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Caisses</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les caisses de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des caisses, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/caisses/caisse-supprimés')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/> Caisses Supprimées
            </button> 
        
            <button onClick={() => navigate('/dash/caisses/ajouter-caisse')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Caisse
            </button> 
        </div>

        <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Caisses..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {funds.length > 0 ? (
                    <>
                        <div className={style.userGrid}>
                            {funds.map(fund => (
                                <CartFund key={fund.id} fund={fund} Delete={deleteFund}/>
                            ))}
                        </div>

                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalFunds}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Caisses trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default Funds