import React, { useEffect, useState } from 'react';
import style from './Storage.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus,  ExternalLink , Ban,SearchX} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchStorages} from './Hooks/useFetchStorages'
import {useDeleteStorage} from './Hooks/useDeleteStorage'
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import CartStorage  from './Components/CartStorage'
import Spinner from '../../../../components/Spinner/Spinner'



const Storage = () => {
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { Storages, totalStorage, loading, error, fetchStorage } = useFetchStorages()

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

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    useEffect(() => {
        fetchStorage({ page: currentPage , limit :limit  });
    }, [currentPage, limit, fetchStorage]);


    const {deleteStorage} = useDeleteStorage(fetchStorage)

   
  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Placement De Stock</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement tous les stocks de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des articles, ainsi que gérer leurs quantités et leurs emplacements.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/Deleted-Storage')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Stock Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/Add-Storage')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Stock
            </button> 
        </div>



        <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Stockage..." />
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
                            <CartStorage key={Storage.id} Storage={Storage}  Delete={deleteStorage} />
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
                        <h1>Aucun Stock trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div> 

    </div>
  )
}

export default Storage