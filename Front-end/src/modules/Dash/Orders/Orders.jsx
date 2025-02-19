import React, { useEffect, useState } from 'react';
import style from './Orders.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useFetchOrders} from './Hooks/useFetchOrders'
import TableauOrders from './Components/TableauOrders'


const Operation= () => {
    const  navigate = useNavigate()

    const { orders, totalOrders, isLoading, message, fetchOrders }= useFetchOrders()
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    //pagination
    const totalPages = Math.ceil(totalOrders / limit);
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
    const endItem = Math.min(currentPage * limit, totalOrders);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }, [totalPages, currentPage]);

    
    useEffect(() => {
      fetchOrders({page: currentPage, limit :limit});
    }, [currentPage, limit,  fetchOrders]);






  return (
    <div className={style.container}>
      <ToastContainer/>

      <div className={style.Headerpage}>
        <div>
          <h1 className={`${style.title} !mb-0 `}>Gestion des Commandes</h1>
          <p className="text-base text-gray-600 mt-0">Consultez et gérez toutes les commandes de votre restaurant.</p>
        </div>
      </div>

      
      <div>
        {isLoading ? (
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
            {orders.length > 0 ? (
              <>
                  <div className="grid grid-cols-1" >
                    <TableauOrders orders={orders}  />
                  </div>
                  
                  <PaginationNav
                      currentPage={currentPage}
                      totalPages={totalPages}
                      startItem={startItem}
                      endItem={endItem}
                      numberOfData={totalOrders}
                      onPreviousPage={handlePreviousPage}
                      onNextPage={handleNextPage}
                  />
              </>
            ) : (
              <div className={style.notfound}>
                  <SearchX className={style.icon} />
                  <h1>Aucune Commande trouvé.</h1>
              </div>
            )}
          </>
        )}
      </div>



    </div>
  )
}

export default Operation