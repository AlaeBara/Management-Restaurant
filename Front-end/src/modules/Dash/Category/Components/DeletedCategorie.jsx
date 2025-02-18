import React, { useEffect, useState } from 'react';
import style from '../Category.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchCategoryDeleted} from "../Hooks/useFetchCategoryDeleted"
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import CategoryCartDeleted from './CartCategorieDeleted'
import {useRestoreCategorie} from '../Hooks/useRestorCategorie'

const CategoryDeleted= () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { categories, totalCategorie, loading, error, fetchCategorie} = useFetchCategoryDeleted()
    //pagination
    const totalPages = Math.ceil(totalCategorie / limit);
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
    const endItem = Math.min(currentPage * limit, totalCategorie);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    
    useEffect(() => {
        fetchCategorie({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchCategorie]);


    const {RestoreCategorie}=useRestoreCategorie(fetchCategorie)

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Catégorie Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des Catégorie supprimées de votre plateforme. Vous pouvez visualiser les Catégorie qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
        </div>

        {/* carts of zone */}

        <div>

            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Catégories Supprimés..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {categories.length > 0 ? (
                    <>
                        <div className={style.userGrid}>
                        {categories.map(categorie => (
                            <CategoryCartDeleted  key={categorie.id} category={categorie}  Restore={RestoreCategorie} />
                        ))}
                        </div>

                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalCategorie}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Catégorie  Supprimés Trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default CategoryDeleted