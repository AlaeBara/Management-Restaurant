import React, { useEffect, useState } from 'react';
import style from './DeletedTags.module.css'
import { useNavigate } from 'react-router-dom'
import {SearchX } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchTagsDeleted} from '../hooks/useFetchTagsDeleted'
import {useRestoreTag} from '../hooks/useRestoreTag'
import Tableau from './TableTagsDeleted'


const Tags= () => {
    const  navigate = useNavigate()

    const { tags, totalTags, Isloading, message, fetchTags } = useFetchTagsDeleted()

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const totalPages = Math.ceil(totalTags / limit);
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
    const endItem = Math.min(currentPage * limit, totalTags);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    useEffect(() => {
        fetchTags({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchTags]);


    const {  RestoreTag }= useRestoreTag(fetchTags , currentPage , limit)



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Tags De Menu Supprimés</h1>
                <p className="text-base text-gray-600 mt-0"> Consultez l'historique des Tags de Menu supprimées de votre plateforme. Vous pouvez visualiser les tag qui ont été supprimées et les restaurer si nécessaire.</p>
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
                    {tags.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1" >
                                <Tableau tags={tags}  RestoreTag={RestoreTag}/>
                            </div>
                            <PaginationNav
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startItem={startItem}
                                endItem={endItem}
                                numberOfData={totalTags}
                                onPreviousPage={handlePreviousPage}
                                onNextPage={handleNextPage}
                            />
                        </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Tag Supprimés Trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>
    </div>
  )
}

export default Tags