import React, { useEffect, useState } from 'react'
import styles from './DetailInventory.module.css'
import { useNavigate, useParams } from 'react-router-dom';   
import Spinner from '@/components/Spinner/Spinner';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {formatDate }from '@/components/dateUtils/dateUtils'
import {useInfoInventory} from './hooks/useFetchInfoInventory'
import{Ban,SearchX,Plus}from 'lucide-react'
import {useFetchAdjustemetByInventory} from './hooks/useFetchAdjustemetByInventory'

const ProduitDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const { inventory, loading, error, fetchInventory}= useInfoInventory(id)

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const {inventorysMovements, totalIventoryMovement, Isloading, message, fetchIventoryMovement}= useFetchAdjustemetByInventory(id)
    useEffect(() => {
        fetchIventoryMovement({fetchAll:true});
        console.log(inventorysMovements)
    }, [fetchIventoryMovement]);


    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Détails du Inventaire</h1>
                    <p>Consultez les informations détaillées du inventaire sélectionné</p>
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
                                {inventory && (
                                    <div className={styles.ProduitInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>SKU du inventaire :</span>
                                            <p>{inventory.sku}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Quantité totale :</span>
                                            <h2>{inventory.totalQuantity}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Quantité d'alerte :</span>
                                            <h2>{inventory.warningQuantity}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Nom du produit :</span>
                                            <h2>{inventory.productName}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Nom du Stock :</span>
                                            <h2>{inventory.storageName}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Date de création :</span>
                                            <p>{formatDate(inventory.createdAt)}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Dernière mise à jour : </span>
                                            <p>{formatDate(inventory.updatedAt)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* <div className={styles.inventorys}>
                    <div>
                        <h2 className={styles.inventorysTitle}>Inventaires :</h2>
                        <p className={styles.inventorysDescription}>Consultez les informations détaillées du produit sélectionné</p>
                    </div>
                </div> */}


                {/* <div>
                    {Isloading ? (
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
                                    <P>ASASA</P>
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
                </div> */}

            </div>
        </>
    )
}

export default ProduitDetails