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
import ResponsiveTable from './Components/tableau'
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'

const ProduitDetails = () => {
    const navigate = useNavigate()
    const { id_iventory } = useParams();

    const { inventory, loading, error, fetchInventory}= useInfoInventory(id_iventory)

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);
    console.log(inventory)

    

    const {inventorysMovements, totalIventoryMovement, Isloading, message, fetchIventoryMovement}= useFetchAdjustemetByInventory(id_iventory)

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    //pagination
    const totalPages = Math.ceil(totalIventoryMovement / limit);
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
    const endItem = Math.min(currentPage * limit, totalIventoryMovement);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    
    useEffect(() => {
        fetchIventoryMovement({page: currentPage, limit :limit});
    }, [currentPage, limit,  fetchIventoryMovement]);

    

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
                            <h1>Informations du Inventaire:</h1>
                            <div className={styles.ProduitCart}>
                                {inventory && (
                                    <div className={styles.ProduitInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>SKU du inventaire :</span>
                                            <p>{inventory.sku}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Quantité totale :</span>
                                            <h2>{inventory.currentQuantity || "-"}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Quantité d'alerte :</span>
                                            <h2>{inventory.warningQuantity}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Nom du produit :</span>
                                            <h2>{inventory?.product?.productName}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Nom du Stock :</span>
                                            <h2>{inventory?.storage?.storageName}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Date de création :</span>
                                            <p>{formatDate(inventory.createdAt)}</p>
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


                <div>
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
                            {inventorysMovements.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1">
                                    <ResponsiveTable data={inventorysMovements} />
                                </div>
                                <PaginationNav
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    startItem={startItem}
                                    endItem={endItem}
                                    numberOfData={totalIventoryMovement}
                                    onPreviousPage={handlePreviousPage}
                                    onNextPage={handleNextPage}
                                />
                            </>
                            ) : (
                            <div className={styles.notfound}>
                                <SearchX className={styles.icon} />
                                <h1>Aucun inventaire movement trouvé.</h1>
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