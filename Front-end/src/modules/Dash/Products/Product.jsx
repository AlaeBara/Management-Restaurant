import React, { useEffect, useState } from 'react';
import style from './Product.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchProduct} from "./Hooks/useFetchProduct"
import PaginationNav from '../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import ProductCart  from './Components/ProductCart'

const Product = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { product, totalProduct, loading, error, fetchProduct} = useFetchProduct()
    //pagination
    const totalPages = Math.ceil(totalProduct / limit);
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
    const endItem = Math.min(currentPage * limit, totalProduct);
  
    
    useEffect(() => {
        fetchProduct({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchProduct]);



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Produits</h1>
                <p className="text-base text-gray-600 mt-0">Gérez efficacement toutes les produits de votre plateforme. Vous pouvez consulter, modifier, ajouter ou supprimer des produits, ainsi que gérer leurs paramètres et leurs configurations.</p>
            </div>
        </div>

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('#')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Produit Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/Produits/Ajouter-Produits')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Produits
            </button> 
        </div>


        {/* carts of zone */}

        <div>

            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Produits..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {product.length > 0 ? (
                    <>

                        <div className={style.userGrid}>
                        {product.map(product => (
                            <ProductCart key={product.id} product={product}  />
                        ))}
                        </div>

                        <PaginationNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startItem={startItem}
                            endItem={endItem}
                            numberOfData={totalProduct}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                        />
                    </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Produit trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default Product