import React, { useEffect, useState } from 'react';
import style from '../Inventory.module.css'
import { useNavigate } from 'react-router-dom'
import {Ban, SearchX } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchIventoryDeleted} from "../Hooks/useFetchIventoryDeleted"
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import CartInventoryDeleted from './CartInventoryDeleted'
import {useRestoreInventory} from '../Hooks/useRestoreInventory'


const InventoryDeleted= () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { inventorys, totalIventory, loading, error, fetchIventory} = useFetchIventoryDeleted()
    //pagination
    const totalPages = Math.ceil(totalIventory / limit);
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
    const endItem = Math.min(currentPage * limit, totalIventory);
  
    
    useEffect(() => {
        fetchIventory({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchIventory]);


    const {RestoreInventory}= useRestoreInventory(fetchIventory)
    
  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Inventaires Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des Inventaires supprimées de votre plateforme. Vous pouvez visualiser les Inventaires qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
        </div>

        <div>
            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Inventaires Supprimés ..." />
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
                            <CartInventoryDeleted key={inventory.id} inventory={inventory} Restore={RestoreInventory} />
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
                        <h1>Aucun Inventaire Supprimés Trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default InventoryDeleted