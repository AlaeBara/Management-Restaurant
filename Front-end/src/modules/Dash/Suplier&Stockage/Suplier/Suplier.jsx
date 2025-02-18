import React, { useEffect, useState } from 'react';
import style from './Suplier.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/Spinner/Spinner';
import { useFetchSupliers } from './Hooks/useFetchSupliers';
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import SuplierCart from './Components/SuplierCarts'
import {useDeleteSupplier} from './Hooks/useDeleteSuplier'


const Supliers = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { Supliers, totalSupliers, loading, error, fetchSupliers} = useFetchSupliers()

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

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    
    useEffect(() => {
        fetchSupliers(currentPage, limit);
    }, [currentPage, limit, fetchSupliers]);


    const {deleteSupplier} = useDeleteSupplier(fetchSupliers)



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Fournisseurs</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement tous les fournisseurs de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des fournisseurs, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/Deleted-Suplier')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Fournisseur Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/Add-Suplier')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Fournisseur
            </button> 
        </div>


        {/* carts of zone */}

        <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Fournisseurs..." />
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
                            <SuplierCart key={suplier.id} supplier={suplier} Delete={deleteSupplier}  />
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
                        <h1>Aucun Fournisseurs trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div> 

    </div>
  )
}

export default Supliers