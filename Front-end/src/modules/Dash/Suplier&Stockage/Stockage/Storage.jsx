import React, { useEffect, useState } from 'react';
import style from './Storage.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus,  ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Storage = () => {
    const navigate = useNavigate()
   


  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Stock</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement tous les stocks de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des articles, ainsi que gérer leurs quantités et leurs emplacements.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('#')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Stock Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/Add-Storage')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Stock
            </button> 
        </div>


        {/* carts of zone */}

        {/* <div>
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
        </div>  */}

    </div>
  )
}

export default Storage