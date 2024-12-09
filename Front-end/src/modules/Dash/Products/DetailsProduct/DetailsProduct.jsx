import React, { useEffect, useState } from 'react'
import styles from './DetailsProduct.module.css'
import { useNavigate, useParams } from 'react-router-dom';   
import Spinner from '../../../../components/Spinner/Spinner';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {formatDate }from '@/components/dateUtils/dateUtils'
import {useInfoProduct} from './hooks/useInfoProduct'
import {useFetchInventorysProduct} from './hooks/useFetchInventoryProduct'
import{Ban,SearchX,Plus}from 'lucide-react'
import CartIventory from './Components/CartInventory'

const ProduitDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const { product, loading, error, fetchProduct } =useInfoProduct(id)
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const { inventorys, iSloading, message, fetchIventory} =useFetchInventorysProduct(id)
    useEffect(() => {
        fetchIventory();
    }, [fetchIventory]);

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Détails du Produit</h1>
                    <p>Consultez les informations détaillées du produit sélectionné</p>
                </div>

                {loading ? (
                    <div className="mt-5">
                        <Spinner title="Chargement des données..." />
                    </div>
                ) : error ? (
                    <div className={styles.notfound}>
                        <Ban className={styles.icon} />
                        <span>{error}</span>
                    </div>
                ) : (
                    <>
                        <div className={styles.ProduitDetails}>
                            <h1>Informations de Produit:</h1>
                            <div className={styles.ProduitCart}>
                                {product && (
                                    <div className={styles.ProduitInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Nom du produit :</span>
                                            <h2>{product.productName}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>SKU du produit :</span>
                                            <p>{product.productSKU}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Description :</span>
                                            <p>{product.productDescription || '-'}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Type de Produit :</span>
                                            <p>{product.productType}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Produit offert :</span>
                                            <p>{product.isOffered ? 'Oui' : 'Non'}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Date de création :</span>
                                            <p>{formatDate(product.createdAt)}</p>
                                        </div>
                                    
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className={styles.inventorys}>
                    <div>
                        <h2 className={styles.inventorysTitle}>Inventaires :</h2>
                        <p className={styles.inventorysDescription}>Consultez les informations détaillées du produit sélectionné</p>
                    </div>
                </div>

                <div className={styles.divBtn}>
                    <button onClick={() => navigate(`/dash/Produits/detail-produit/${id}/ajouter-inventaire`)} className={styles.addBtn}>
                        <Plus className="mr-3 h-4 w-4 " /> Ajouter Inventaire
                    </button> 
                </div>

                <div>
                    {iSloading ? (
                        <div className="mt-5">
                            <Spinner title="Chargement des données..." />
                        </div>
                    ) : message ? (
                    <div className={styles.notfound}>
                        <Ban className={styles.icon} />
                        <span>{message}</span>
                    </div>
                    ) : (
                        <>
                            {inventorys.length > 0 ? (
                            <>
                                <div>
                                {inventorys.map(inventory => (
                                    <CartIventory key={inventory.id} inventory={inventory}/>
                                ))}
                                </div>
                            </>
                            ) : (
                            <div className={styles.notfound}>
                                <SearchX className={styles.icon} />
                                <h1>Aucun inventaire associé au produit trouvé.</h1>
                            </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </>
    )
}

export default ProduitDetails