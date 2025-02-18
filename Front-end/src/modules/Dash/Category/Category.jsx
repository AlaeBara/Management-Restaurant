import React, { useEffect, useState } from 'react';
import style from './Category.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchCategory} from "./Hooks/useFetchCategory"
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import CategoryCart from './Components/CartCategory'
import {useDeleteCategorie} from './Hooks/useDeletedCategorie'


const Category= () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { categories, totalCategorie, loading, error, fetchCategorie} = useFetchCategory()
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

    const {deleteCategorie}=useDeleteCategorie(fetchCategorie)


  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Catégorie</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les Catégorie de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer les catégorie, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/categories-Produits/categories-supprimés')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Catégorie Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/categories-Produits/ajouter-categorie')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Catégorie
            </button> 
        </div>


        {/* carts of zone */}

        <div>

            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Catégories..." />
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
                            <CategoryCart key={categorie.id} category={categorie}  Delete={deleteCategorie} />
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
                        <h1>Aucun Catégorie trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default Category