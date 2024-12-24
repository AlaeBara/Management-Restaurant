import React, { useEffect, useState } from 'react';
import style from './Discount.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus , SearchX ,ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';


const Tags= () => {
    const  navigate = useNavigate()

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion des Codes Promo</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement vos codes promo. Ajoutez, modifiez et organisez vos promotions pour attirer davantage de clients.</p>
            </div>
        </div>
    
        <div className={style.Headerpage2}>
            <button onClick={() => navigate(`/dash/code-promo/ajouter-promo`)} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Promo
            </button> 
        </div>



        {/* <div>
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
                                <Tableau tags={tags} deleteTag={deleteTag} fetchTags={fetchTags}/>
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
                        <h1>Aucun Tag trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div> */}

    </div>
  )
}

export default Tags