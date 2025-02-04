import React, { useEffect, memo,useState } from 'react';
import styles from './Cart.module.css';
import { useTranslation } from 'react-i18next';
import { Trash, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useClientPreferences } from '../../../../context/OrderFlowContext';
import { useCart } from '../../../../context/CartContext'; // Import useCart from your CartContext
import { Loader } from 'lucide-react';


const Cart = memo(({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();
  const { language } = useClientPreferences();
  const { cart,  removeFromCart, updateCartItemQuantity } = useCart(); // Use the cart context
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cart !== undefined) {
      setIsLoading(false);
    }
  }, [cart]);

  const handleDelete = (itemId) => {
    removeFromCart(itemId); // Use the context function to remove an item
  };

  const handleQuantityChange = (itemId, change) => {
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change); // Ensure quantity is at least 1
      updateCartItemQuantity(itemId, newQuantity); // Use the context function to update quantity
    }
  };

  const calculateTotal = (item) => {
    return (item.quantity * item.finalPrice).toFixed(2);
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <div className={styles.container} dir={dir}>
        <h1 className={styles.title}>{t('Your Food Cart')}</h1>
        <div className={styles.cartItems}>
          {isLoading ? (
            <div className='mt-[20vh] flex flex-col justify-center items-center'>
              <Loader className="h-6 w-6 animate-spin" />
              <p>{t('loading_cart')}</p>
            </div>
          ) : cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemDetails}>
                    {/* Name and Price */}
                    <div className={styles.itemHeader}>
                      <span className={styles.itemName}>
                        {item.translates?.find((t) => t.languageValue === language)?.name || item.name || 'No Name'}
                      </span>
                      <span className={styles.itemPrice}>
                        {item.finalPrice} Dh
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className={styles.itemHeader}>
                      <span className={styles.quantityLabel}>
                        {t('Quantity')}:
                      </span>
                      <div className={styles.quantityControl}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className={styles.iconn} />
                        </button>
                        <span className={styles.quantityValue}>
                          {item.quantity}
                        </span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus className={styles.iconn} />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className={styles.itemHeader}>
                      <span className={styles.quantityLabel}>
                        {t('Total')}:
                      </span>
                      <span className={styles.itemPrice}>
                        {calculateTotal(item)} Dh
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash className={styles.icon} />
                    {t('Delete')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyCart}>
              <p className={styles.emptyCartText}>{t('Your cart is empty')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Navigation Buttons */}
      <div className={styles.btnBox}>
        <button className={styles.btn_back} onClick={previousStep}>
          <ArrowLeft /> {t('Previous')}
        </button>
        <button
          className={`${styles.btn_next} ${cart.length === 0 ? styles.btn_disabled : ''}`}
          onClick={nextStep}
          disabled={cart.length === 0}
        >
          {t('Next')}
        </button>
      </div>
    </>
  );
});

export default Cart;