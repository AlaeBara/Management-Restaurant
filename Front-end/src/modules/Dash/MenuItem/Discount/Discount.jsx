import React, { useEffect, useState } from 'react';
import style from './Discount.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus , SearchX ,ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchDiscounts} from './Hooks/useFetchDiscounts'
import Tableau from './Components/Tableau'


const Discount= () => {
    const  navigate = useNavigate()

    const { discounts, totalDiscounts, Isloading, message, fetchDiscounts } =useFetchDiscounts()

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
  
    useEffect(() => {
        fetchDiscounts({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchDiscounts]);


  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion des Codes Promo</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement vos codes promo. Ajoutez, modifiez et organisez vos promotions pour attirer davantage de clients.</p>
            </div>
        </div>
    
        <div className={style.Headerpage2}>
            <button onClick={() => navigate(`/dash/code-promo/ajouter-promo`)} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Promo
            </button> 
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
                                <Tableau Discounts={discounts} />
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
                        <h1>Aucun  code promo trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>

    </div>
  )
}

export default Discount