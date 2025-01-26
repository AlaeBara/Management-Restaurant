import React, { useState, useEffect, memo } from 'react';
import styles from './Cart.module.css';
import { useTranslation } from 'react-i18next';
import { Trash, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useClientPreferences } from '../../../../context/OrderFlowContext';

const Cart = memo(({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();
  const { language } = useClientPreferences();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleDelete = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (itemId, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
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
            <div className={styles.loading}>
              <p>{t('loading_cart')}</p>
            </div>
          ) : cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  {/* <div className={styles.imageWrapper}>
                    <img
                      src={item.image} 
                      alt={item.name || 'Item'}
                      className={styles.itemImage}
                    />
                  </div> */}
                  <div className={styles.itemDetails}>
                    {/* Name and Price */}
                    <div className={styles.itemHeader}>
                      <span className={styles.itemName}>
                        {item.translates?.find((t) => t.languageValue === language)?.name || item.name || 'No Name'}
                      </span>
                      <span className={styles.itemPrice}>
                        ${item.finalPrice}
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
                        ${calculateTotal(item)}
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
          className={`${styles.btn_next}`}
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