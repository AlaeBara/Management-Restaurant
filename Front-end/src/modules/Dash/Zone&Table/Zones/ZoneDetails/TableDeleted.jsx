import React, { useEffect, useState } from 'react';
import style from './TableDeleted.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchZoneDeleted} from "../Hooks/useFetchTableDeleted"
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import { useRestoreTable } from '../Hooks/useRestoreTable';
import CartTableDeleted from './CartTableDeleted';

const DeletedZones = () => {
    const  navigate = useNavigate()
    const {id} = useParams()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const {  tables, totalTables, loading, error, fetchTableDeleted} = useFetchZoneDeleted(id)
    
    //pagination
    const totalPages = Math.ceil(totalTables / limit);
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
    const endItem = Math.min(currentPage * limit, totalTables);
  
    
    useEffect(() => {
        fetchTableDeleted(currentPage, limit);
    }, [currentPage, limit, fetchTableDeleted]);


    const {Restoretable} = useRestoreTable(fetchTableDeleted)
    

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Table Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des Table supprimées de votre plateforme. Vous pouvez visualiser les Table qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
        </div>

        {/* carts of zone deleted */}

        <div>

            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Table Supprimés..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {tables.length > 0 ? (
                    <>

                        <div className={style.userGrid}>
                        {tables.map(table=> (
                            <CartTableDeleted key={table.id} table={table}  Restore={Restoretable}/>
                        ))}
                        </div>

                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalTables}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Table Supprimé trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default DeletedZones