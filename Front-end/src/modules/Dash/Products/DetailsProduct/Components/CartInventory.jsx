import React from 'react'
import styles from './CartInventory.module.css'
import 'react-toastify/dist/ReactToastify.css';
import {formatDate }from '@/components/dateUtils/dateUtils'
import{ClipboardList ,Move , Sliders}from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom';



const CartIventory = ({inventory}) => {
    const navigate = useNavigate()
    const {id}=useParams()


    return (
        <>
            <div className={styles.InventoryDetails}>
                <h1><ClipboardList className='mr-2'/> {inventory.storageName}</h1>
                <div className={styles.InventoryCart}>
                    <div className={styles.InventoryInfo}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>SKU du Inventaire :</span>
                            <p>{inventory.sku}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Nom du produit :</span>
                            <h2>{inventory.productName}</h2>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>L'unité de produit:</span>
                            <p>{inventory.productUnit}</p>
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

                    <div className={`${styles.actions}`}>
                        <button
                            className={`${styles.actionButton} ${styles.AddButton}`}
                        >
                            <Move className="mr-2 h-5 w-4" />Movement
                        </button>
                        <button
                            onClick={()=>navigate(`/dash/Produits/detail-produit/${id}/adjustment/${inventory.id}`)}
                            className={`${styles.actionButton} ${styles.AddButton}`}
                        >
                            <Sliders className="mr-2 h-4 w-4" />Adjustment
                        </button>
                    </div>
                </div>
            </div>
        </>
                
        
    )
}

export default CartIventory