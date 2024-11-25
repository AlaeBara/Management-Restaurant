import React, { useEffect, useState } from 'react';
import style from '../Units.module.css'
import { useNavigate } from 'react-router-dom'
import {Ban, SearchX } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchUnitsDeleted} from "../Hooks/useFetchDeletedUnits"
import PaginationNav from '@/modules/Dash/UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import CartUnits from './CartUnitDeleted'
import {useRestoreUnit} from '../Hooks/useRestorUnit'

const UnitsDeleted = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { units, totalUnits, loading, error,  fetchUnits} = useFetchUnitsDeleted()

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


    const {RestoreUnit} = useRestoreUnit(fetchUnits)


  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Unités Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des  Unités supprimées de votre plateforme. Vous pouvez visualiser les unités qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
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
                            <CartUnits key={unit.id} unit={unit} RESTOR={RestoreUnit}/>
                        ))}
                        </div>

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
                        <h1>Aucun Unités Supprimé  trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default UnitsDeleted