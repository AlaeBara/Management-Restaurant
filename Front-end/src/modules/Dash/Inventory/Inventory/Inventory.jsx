import React, { useEffect, useState } from 'react';
import style from './Inventory.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchIventory} from "./Hooks/useFetchIventory"
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import CartInventory from './Components/CartInventory'



const Category= () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { inventorys, totalIventory, loading, error, fetchIventory} = useFetchIventory()
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



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Inventaires</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les Inventaires de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des Inventaires, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('#')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Inventaire Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/inventaires/ajouter-inventaire')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Inventaire
            </button> 
        </div>

        <div>
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
                            <CartInventory key={inventory.id} inventory={inventory} />
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
        </div>




    </div>
  )
}

export default Category