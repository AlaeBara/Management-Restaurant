import React from 'react';
import styles from './Carts.module.css';
import { formatDate } from '@/components/dateUtils/dateUtils';
import { Trash2 } from 'lucide-react';

const Cart = React.memo(({ showCart }) => {
  return (
    <div
      id="cartSection"
      className={`${styles.cartSection} ${showCart ? styles.cartOpen : ''}`}
    >

      <div className={styles.DivTitle}>
        <h2 className={`text-2xl font-bold ${styles.Title}`}>Commande actuelle</h2>
        <p className='text-ms text-gray-500'>Date : {formatDate(new Date())}</p>
      </div>
      
      <div className={styles.cartItems}>
      </div>

      <div className={`${styles.cartSummary} shadow-sm`}>
        <p>Total:</p>
        <p>0 Dh</p>
      </div>
        
      <div className={styles.DivButton}>  
        <button className={styles.paymentButton}>Enregistrer la commande</button>
        <button className={styles.CleanButton}><Trash2 /></button>
      </div>
    </div>
  );
});

export default Cart;