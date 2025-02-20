import React from 'react';
import styles from './Carts.module.css';

const Cart = React.memo(({ showCart }) => {
  return (
    <div
      id="cartSection"
      className={`${styles.cartSection} ${showCart ? styles.cartOpen : ''}`}
    >
        <h2>Current Order</h2>

        <div className={styles.cartItems}>
            <div className={styles.cartItem}>Item 1</div>
            <div className={styles.cartItem}>Item 2</div>
        </div>

        <div className={styles.cartSummary}>
            <p>Subtotal: $XX.XX</p>
            <p>Tax: $X.XX</p>
            <p>Discount: $X.XX</p>
            <p>Total: $XX.XX</p>
        </div>
        
        <button className={styles.paymentButton}>Continue to Payment</button>
    </div>
  );
});

export default Cart;