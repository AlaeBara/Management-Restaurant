import React, { useEffect, useState } from 'react';
import style from './TransfertOperations.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchOperationTransfert} from './hooks/useFetchOperations'
import TableauTransfert from './Components/TableauTransfert'
import {useConfirmTansferOperation} from './Hooks/useConfirmTransferOperation'

const Operation= () => {
    const  navigate = useNavigate()

    const {transferts, totalTransferts, Isloading, message,  fetchTransfertOperation} = useFetchOperationTransfert()


    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    //pagination
    const totalPages = Math.ceil(totalTransferts / limit);
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
    const endItem = Math.min(currentPage * limit, totalTransferts);

    
    useEffect(() => {
        fetchTransfertOperation({page: currentPage, limit :limit});
    }, [currentPage, limit,  fetchTransfertOperation]);


    const {ConfirmOperation}=useConfirmTansferOperation(fetchTransfertOperation)




  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Transfert Opérations</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les dépenses de votre plateforme. Vous pouvez consulter,  ajouter des dépenses, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/transfert-operations/ajouter-transfert')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Transfert
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
                    {transferts.length > 0 ? (
                    <>
                        <div>
                            <TableauTransfert data={transferts}  Confirm={ConfirmOperation}/>
                        </div>
                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalTransferts}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Transfert Opération trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>



    </div>
  )
}

export default Operation