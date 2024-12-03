import React, { useEffect, useState } from 'react';
import style from '../Fund.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchFundsDeleted } from '../hooks/useFetchFundsDeleted'
import CartFundDeleted from './CartFundDeleted'
import {useRestoreFund} from '../hooks/useRestoreFund'

const Funds= () => {
    const  navigate = useNavigate()

    const { funds, totalFunds, loading, error, fetchFunds } = useFetchFundsDeleted ()
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

    const {RestoreFund}= useRestoreFund(fetchFunds)

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Caisses Supprimées</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des caisses supprimées de votre plateforme. Vous pouvez visualiser les caisses qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
        </div>

    
        <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Caisses Supprimées..." />
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
                                <CartFundDeleted key={fund.id} fund={fund} Restore={RestoreFund}/>
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
                        <h1>Aucun Caisses Supprimées trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default Funds