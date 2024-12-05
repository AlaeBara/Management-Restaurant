import React, { useEffect, useState } from 'react';
import style from './ShiftZone.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ZoneCart from './Components/CartShiftZone';
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchZonesWithWaiters} from "./Hooks/useFetchZonesWithWaiters"
import {useStartShift} from './Hooks/useStartShift'
import {useEndShift} from './Hooks/useEndShift'


const ShiftZones = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const {  zones, totalZones, loading, error, fetchZones} = useFetchZonesWithWaiters()
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
        fetchZones({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchZones]);

    const {StartShift}= useStartShift(fetchZones)
    const {EndShift}= useEndShift(fetchZones)



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Zones</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les zones de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des zones, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div>

            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Zones..." />
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
                            <ZoneCart key={zone.id} zone={zone}  EndShift={EndShift} StartShift={StartShift}/>
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
                        <h1>Aucun Zone trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>

    </div>
  )
}

export default ShiftZones