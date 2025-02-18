import React, { useEffect, useState } from 'react';
import style from '../Product.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus, Ban, SearchX , ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useFetchProductDeleted} from "../Hooks/useFetchProductDeleted"
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import ProductCartDeleted  from './ProductCartDeleted'
import {useRestoreProduct} from '../Hooks/useRestoreProduct'



const ProductDeleted = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { product, totalProduct, loading, error, fetchProduct} = useFetchProductDeleted()
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

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    
    useEffect(() => {
        fetchProduct({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchProduct]);

    const {RestoreProduct} = useRestoreProduct(fetchProduct)

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Produits Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des Produits supprimées de votre plateforme. Vous pouvez visualiser les Produits qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
        </div>

        {/* carts of zone */}

        <div>

            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Produits Supprimés..." />
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
                            <ProductCartDeleted key={product.id} product={product} Restore={RestoreProduct}  />
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
                        <h1>Aucun Produit Supprimés trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default ProductDeleted