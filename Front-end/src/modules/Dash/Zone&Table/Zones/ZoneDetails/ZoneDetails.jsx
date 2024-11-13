import React, { useEffect, useState } from 'react';
import style from './ZoneDetails.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TableCarts from '../Components/TableCarts'


const Zones = () => {
    const  navigate = useNavigate()

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Table de Zone Terasse</h1>
                <p className="text-base text-gray-600 mt-0">Consultez et gérez les détails spécifiques de cette zone. Vous pouvez voir les tables associées, leur disposition et modifier les paramètres de la zone sélectionnée.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/Add-Zone')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Table
            </button> 
        </div>

        <div className={style.userGrid}>
            <TableCarts/>
            <TableCarts/>
            <TableCarts/>
            <TableCarts/>
        </div>
    </div>
  )
}

export default Zones