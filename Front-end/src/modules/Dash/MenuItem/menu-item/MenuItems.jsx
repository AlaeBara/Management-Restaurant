import React, { useEffect, useState } from 'react';
import style from './MenuItems.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus , SearchX ,Ban} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchProduits} from './hooks/useFetchProducts'
import Tableau from './Components/Tableau'

const produit= () => {
    const  navigate = useNavigate()

    const {produits, totalProduits, Isloading, message, fetchProduits}=useFetchProduits()
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const totalPages = Math.ceil(totalProduits / limit);
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
    const endItem = Math.min(currentPage * limit, totalProduits);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    useEffect(() => {
        fetchProduits({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchProduits]);


  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Produits du Menu</h1>
                <p className="text-base text-gray-600 mt-0">  Gérez efficacement les éléments de votre menu. Ajoutez et organisez vos produits pour une meilleure gestion et présentation.</p>
            </div>
        </div>
    
        <div className={style.Headerpage2}>
            <button onClick={() => navigate(`/dash/produits-menu/ajouter-produit`)} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Produit
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
                    {produits.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1" >
                                <Tableau produits={produits}/>
                            </div>
                            <PaginationNav
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startItem={startItem}
                                endItem={endItem}
                                numberOfData={totalProduits}
                                onPreviousPage={handlePreviousPage}
                                onNextPage={handleNextPage}
                            />
                        </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Produit menu trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>

    </div>
  )
}

export default produit