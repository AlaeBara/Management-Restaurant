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
                <h1><ClipboardList className='mr-2'/> {inventory.sku}</h1>
                <div className={styles.InventoryCart}>
                    <div className={styles.InventoryInfo}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Placement de Stock :</span>
                            <p>{inventory.storageName || '-'}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Nom du produit :</span>
                            <h2>{inventory.productName}</h2>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Quantité totale:</span>
                            <h2>{inventory.totalQuantity} {inventory.productUnit}</h2>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Date de création :</span>
                            <p>{formatDate(inventory.createdAt)}</p>
                        </div>
                    </div>

                    <div className={`${styles.actions}`}>
                        <button
                            onClick={()=>navigate(`/dash/Produits/detail-produit/${id}/inventaire/${inventory.id}`)}
                            className={`${styles.actionButton} ${styles.addButton}`}
                        >
                            <Move className="mr-2 h-5 w-4" />Movement
                        </button>
                        <button
                            onClick={()=>navigate(`/dash/Produits/detail-produit/${id}/adjustment/${inventory.id}`)}
                            className={`${styles.actionButton} ${styles.addButton}`}
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