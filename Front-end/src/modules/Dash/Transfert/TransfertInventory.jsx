import React, { useEffect, useState } from 'react';
import style from './TransfertInventory.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';




const Operation= () => {
    const  navigate = useNavigate()

    // const { operations, totalOperations, Isloading, message, fetchOperation }= useFetchOperation()
    // const [currentPage, setCurrentPage] = useState(1);
    // const [limit] = useState(10);
    // //pagination
    // const totalPages = Math.ceil(totalOperations / limit);
    // const handleNextPage = () => {
    //     if (currentPage < totalPages) {
    //        setCurrentPage(prev => prev + 1);
    //     }
    // };
    // const handlePreviousPage = () => {
    //     if (currentPage > 1) {
    //        setCurrentPage(prev => prev - 1);
    //     }
    // };
    // const startItem = (currentPage - 1) * limit + 1;
    // const endItem = Math.min(currentPage * limit, totalOperations);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    // useEffect(() => {
    //     if (currentPage > totalPages && totalPages > 0) {
    //         setCurrentPage(totalPages);
    //     }
    // }, [totalPages, currentPage]);

    
    // useEffect(() => {
    //     fetchOperation({page: currentPage, limit :limit});
    // }, [currentPage, limit,  fetchOperation]);





  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Transferts Inventaire</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les transferts inventaire de votre plateforme. Vous pouvez consulter,  ajouter des transferts, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/transfert-inventaire/ajouter-transfert')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Transfert
            </button> 
        </div>

        {/* <div>
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
                    {operations.length > 0 ? (
                    <>
                        <div>
                            <TableauOperation data={operations} Confirm={ConfirmOperation} confirmTransferOperation={confirmTransferOperation}  />
                        </div>
                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalOperations}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Operation trouvé.</h1>
                    </div>
                    )}
                </>
            )}
        </div> */}



    </div>
  )
}

export default Operation