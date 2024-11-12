import React, { useEffect, useState } from 'react';
import style from './DeletedZone.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchZoneDeleted} from "../Hooks/useFetchzoneDeleted"
import ZoneCart from './ZoneCart';
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import { useRestoreZone } from '../Hooks/useRestoreZone';
import ZoneCartDeleted from './ZoneCartDeleted';

const DeletedZones = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const {  zones, totalZones, loading, error, fetchZones} = useFetchZoneDeleted()

    //pagination
    const totalPages = Math.ceil(totalZones / limit);
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
    const endItem = Math.min(currentPage * limit, totalZones);
  
    
    useEffect(() => {
        fetchZones(currentPage, limit);
    }, [currentPage, limit, fetchZones]);


    const {RestoreZone} = useRestoreZone(fetchZones)
    

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Zones Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des zones supprimées de votre plateforme. Vous pouvez visualiser les zones qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
        </div>

        {/* carts of zone deleted */}

        <div>

            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Zones Supprimés..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {zones.length > 0 ? (
                    <>

                        <div className={style.userGrid}>
                        {zones.map(zone => (
                            <ZoneCartDeleted key={zone.id} zone={zone}  Restore={RestoreZone}/>
                        ))}
                        </div>

                        <PaginationNav
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startItem={startItem}
                        endItem={endItem}
                        numberOfData={totalZones}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Zone Supprimé trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default DeletedZones