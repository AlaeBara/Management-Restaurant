import React, { useEffect, useState } from 'react'
import styles from './DetailsFund.module.css'
import { useNavigate, useParams } from 'react-router-dom';   
import Spinner from '@/components/Spinner/Spinner';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {formatDate }from '@/components/dateUtils/dateUtils'
import {useFetchFund} from './hooks/useFetchFund'
import{Ban,SearchX,Plus}from 'lucide-react'
import {useGetOperationFund} from './Hooks/useGetOperationFund'
import TableauOperation from './Components/TableauOpertion'
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import {useConfirmOperation} from './hooks/useConfirmOperation'

const FundDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const  {fund, loading, error, fetchFund} = useFetchFund(id)

    useEffect(() => {
        fetchFund();
    }, [fetchFund]);

    const { operations, totalOperations, Isloading, message, fetchOperation }= useGetOperationFund(id)
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    //pagination
    const totalPages = Math.ceil(totalOperations / limit);
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
    const endItem = Math.min(currentPage * limit, totalOperations);

    
    useEffect(() => {
        fetchOperation({page: currentPage, limit :limit});
    }, [currentPage, limit,  fetchOperation]);


    const TypeFunds = [
        { value: 'main', label: 'Principal' },
        { value: 'waiters', label: 'Serveurs' },
        { value: 'kitchen', label: 'Cuisine' },
        { value: 'bar', label: 'Bar' },
        { value: 'delivery', label: 'Livraison' },
        { value: 'online', label: 'En ligne' },
        { value: 'other', label: 'Autre' },
    ];

    const obtenirLibelleType = (valeur) => {
        const type = TypeFunds.find(t => t.value === valeur);
        return type ? type.label : valeur;
    };

    const {ConfirmOperation}= useConfirmOperation(fetchOperation ,currentPage, limit)


    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Détails de la Caisse</h1>
                    <p>Consultez les informations détaillées de la Caisse sélectionné</p>
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
                            <h1>Informations de la Caisse:</h1>
                            <div className={styles.ProduitCart}>
                                {fund && (
                                    <div className={styles.ProduitInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>SKU de la caisse :</span>
                                            <p>{fund.sku}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Nom de la Caisse :</span>
                                            <h2>{fund.name}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Type de la Caisse :</span>
                                            <h2>{obtenirLibelleType(fund.type)}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Solde :</span>
                                            <h2>{fund.balance} Dh</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Description :</span>
                                            <h2>{fund.description}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Actif :</span>
                                            <h2>{fund.isActive ? 'Oui' :'Non'}</h2>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Date de création :</span>
                                            <p>{formatDate(fund.createdAt)}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>Dernière mise à jour : </span>
                                            <p>{formatDate(fund.updatedAt)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
                

                <div className={styles.inventorys}>
                    <div>
                        <h2 className={styles.inventorysTitle}>Les Operations :</h2>
                        <p className={styles.inventorysDescription}>Consultez les informations détaillées des opérations de cette caisse</p>
                    </div>

                    <div className={styles.btnadd}>
                        <button onClick={() => navigate(`/dash/caisses/detail/${id}/ajouter-operation`)} className={styles.showFormButton}>
                            <Plus className="mr-3 h-4 w-4 " /> Ajouter Operation
                        </button> 
                    </div>
                </div>

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
                            {operations.length > 0 ? (
                            <>
                                <div className={styles.userGrid}>
                                    <TableauOperation data={operations} Confirm={ConfirmOperation} />
                                </div>
                                <PaginationNav
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    startItem={startItem}
                                    endItem={endItem}
                                    numberOfData={totalOperations}
                                    onPreviousPage={handlePreviousPage}
                                    onNextPage={handleNextPage}
                                />
                            </>
                            ) : (
                            <div className={styles.notfound}>
                                <SearchX className={styles.icon} />
                                <h1>Aucun Operation trouvé.</h1>
                            </div>
                            )}
                        </>
                    )}
                </div>

            </div>

        </>
    )
}

export default  FundDetails 