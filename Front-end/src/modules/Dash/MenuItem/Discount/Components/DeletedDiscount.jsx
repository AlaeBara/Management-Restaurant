import React, { useEffect, useState } from 'react';
import style from './DeletedDiscount.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus , SearchX ,ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import Tableau from './TableauOfDeleted'
import {useFetchDiscountsDeleted} from '../Hooks/useFetchDiscountsDeleted'
import {useRestoreDiscount} from '../Hooks/useRestoreDiscount'

const DiscountDeleted= () => {
    const  navigate = useNavigate()

    const { discounts, totalDiscounts, Isloading, message, fetchDiscounts } = useFetchDiscountsDeleted()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const totalPages = Math.ceil(totalDiscounts / limit);
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
    const endItem = Math.min(currentPage * limit, totalDiscounts);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    useEffect(() => {
        fetchDiscounts({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchDiscounts]);

   const {RestoreDiscount}=useRestoreDiscount(fetchDiscounts,currentPage, limit)


  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Code Promo  Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des Code Promo supprimées de votre plateforme. Vous pouvez visualiser les Code Promo qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
        </div>
    
    
        <div>
            {Isloading ? (
                <div className="mt-5">
                    <Spinner title="Chargement des données..." />
                </div>
            ) : message ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{message}</span>
            </div>
            ) : (
                <>
                    {discounts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1" >
                                <Tableau Discounts={discounts}  Restore={RestoreDiscount}/>
                            </div>
                            <PaginationNav
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startItem={startItem}
                                endItem={endItem}
                                numberOfData={totalDiscounts}
                                onPreviousPage={handlePreviousPage}
                                onNextPage={handleNextPage}
                            />
                        </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Code Promo Supprimés Trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>

    </div>
  )
}

export default DiscountDeleted