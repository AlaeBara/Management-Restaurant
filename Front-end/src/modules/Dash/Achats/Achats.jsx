import React, { useEffect, useState } from 'react';
import style from './Achats.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus , SearchX} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import Tableau from './Components/Tableau'
import {useFetchPurchases} from './Hooks/useFetchPurchases'


const Achats= () => {
    const  navigate = useNavigate()

    const {purchases, totalPurchases, Isloading, message, fetchPurchases}=useFetchPurchases()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    //pagination
    const totalPages = Math.ceil(totalPurchases / limit);
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
    const endItem = Math.min(currentPage * limit, totalPurchases);
  
    useEffect(() => {
        fetchPurchases({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchPurchases]);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Bon De Commande</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les dépenses de votre plateforme. Vous pouvez consulter,  ajouter des dépenses, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/ajoute-achat')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Bon de Commande
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
                    {purchases.length > 0 ? (
                    <>
                        <div className="flex justify-center" >
                            <div className='overflow-x-auto max-w-[90vw] lg:max-w-[95vw]'>
                                <Tableau data={purchases} />
                            </div>
                        </div>
                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalPurchases}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Achats trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>

    </div>
  )
}

export default  Achats