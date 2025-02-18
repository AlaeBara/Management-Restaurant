import React, { useEffect, useState } from 'react';
import style from './DeletedChoice.module.css'
import { useNavigate } from 'react-router-dom'
import {SearchX } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';


import {useFetchChoiceDeleted} from '../hooks/useFetchChoiceDeleted'
import Tableau from './TableauChoiceDeleted'
import { useRestoreChoice } from '../hooks/useRestoreChoice';
import { Ban } from 'lucide-react';

const DeletedChoice= () => {
    const  navigate = useNavigate()

    const { choices, totalChoices, Isloading, message, fetchChoices } = useFetchChoiceDeleted()

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const totalPages = Math.ceil(totalChoices / limit);
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
    const endItem = Math.min(currentPage * limit, totalChoices);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    useEffect(() => {
        fetchChoices({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchChoices]);


    const {restoreChoice}= useRestoreChoice(fetchChoices , currentPage , limit)



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Choix Supprimés</h1>
                <p className="text-base text-gray-600 mt-0"> Consultez l'historique des Choix de Menu supprimées de votre plateforme. Vous pouvez visualiser les Choix qui ont été supprimées et les restaurer si nécessaire.</p>
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
                    {choices.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1" >
                                <Tableau choices={choices}  restoreChoice={restoreChoice}/>
                            </div>
                            <PaginationNav
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startItem={startItem}
                                endItem={endItem}
                                numberOfData={totalChoices}
                                onPreviousPage={handlePreviousPage}
                                onNextPage={handleNextPage}
                            />
                        </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Choix Supprimés Trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>
    </div>
  )
}

export default DeletedChoice