import React, { useEffect, useState } from 'react';
import style from './Units.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchUnits} from "./Hooks/useFetchUnits"
import PaginationNav from '@/modules/Dash/UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import CartUnits from './Components/CartUnits'

const Units = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { units, totalUnits, loading, error,  fetchUnits} = useFetchUnits()

    //pagination
    const totalPages = Math.ceil(totalUnits / limit);
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
    const endItem = Math.min(currentPage * limit,totalUnits);
  
    
    useEffect(() => {
        fetchUnits({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchUnits]);



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Unités</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les unités de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des unités, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/Deleted-Zone')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Unités Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/Units/Add-Units')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter unité
            </button> 
        </div>


        {/* carts of zone */}

        <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Unités..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {units.length > 0 ? (
                    <>
                        <div className={style.userGrid}>
                        {units.map(unit => (
                            <CartUnits key={unit.id} unit={unit}/>
                        ))}
                        </div>Update-Units

                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalUnits}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Unités trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default Units