import React, { useEffect, useState } from 'react';
import style from './Fund.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchFunds} from './hooks/useFetchFunds'



const Inventory= () => {
    const  navigate = useNavigate()

    const { funds, totalFunds, loading, error, fetchFunds } = useFetchFunds()

    
  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Caisses</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les caisses de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des caisses, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/caisses')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/> Caisses Supprimées
            </button> 
        
            <button onClick={() => navigate('/dash/caisses/ajouter-caisse')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Caisse
            </button> 
        </div>

        {/* <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Inventaires..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {inventorys.length > 0 ? (
                    <>
                        <div className={style.userGrid}>
                        {inventorys.map(inventory => (
                            <CartInventory key={inventory.id} inventory={inventory} Delete={deleteInventory} />
                        ))}
                        </div>

                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalIventory}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Inventaire trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div> */}




    </div>
  )
}

export default Inventory