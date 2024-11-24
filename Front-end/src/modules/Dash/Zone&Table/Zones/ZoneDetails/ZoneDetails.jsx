import React, { useEffect, useState } from 'react';
import style from './ZoneDetails.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableCarts from '../Components/TableCarts'
import {useFetchTableOfZone } from '../Hooks/useFetchTableOfZone'
import PaginationNav from  '@/modules/Dash/UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner'
import {useGetInfoZone} from '../Hooks/useGetInfoZone'
import {useDeleteTable} from '../Hooks/useDeleteTable'

const ZoneDetails  = () => {
    const  navigate = useNavigate()
    const {id} = useParams()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { tables, totalTables, loading, error, fetchTableOfZone} = useFetchTableOfZone(id)
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
        fetchTableOfZone({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchTableOfZone]);

    const {info, message, isloading} = useGetInfoZone(id)

    const {deleteTable} = useDeleteTable(fetchTableOfZone)




return(
    <div className={style.container}>

        <ToastContainer/>

        {isloading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des données de la zone..." />
            </div>
            ) : message ? (
                <div className={style.notfound}>
                    <Ban className={style.icon} />
                    <span>{message}</span>
                </div>
            ) : (
            <>
                <div className={style.Headerpage}>
                    <div>
                        <h1 className={`${style.title} !mb-0 `}>Tables de Zone : {info.zoneLabel}  </h1>
                        <p className="text-base text-gray-600 mt-0">Consultez et gérez les détails spécifiques de cette zone. Vous pouvez voir les tables associées, leur disposition et modifier les paramètres de la zone sélectionnée.</p>
                    </div>
                </div>

                <div className={style.Headerpage2}>

                    <button onClick={() => navigate(`/dash/Zone/${id}/Table-deleted`)} className={style.showdeleteuser}> 
                        <ExternalLink className="mr-3 h-4 w-4 "/>Table Supprimés 
                    </button>
                    <button onClick={() => navigate(`/dash/Zone/${id}/Add-table`)} className={style.showFormButton}>
                        <Plus className="mr-3 h-4 w-4 " /> Ajouter Table
                    </button> 
                </div>

                <div>
                    {loading ? (
                        <div className={style.spinner}>
                            <Spinner title="Chargement des Tables..." />
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
                                {tables.map(table => (
                                    <TableCarts key={table.id} table={table} Delete={deleteTable}/>
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
                                <h1>Aucun Table trouvé</h1>
                            </div>
                            )}
                        </>
                    )}
                </div>
            </>
        )}
  
    </div>
)
}

export default ZoneDetails 