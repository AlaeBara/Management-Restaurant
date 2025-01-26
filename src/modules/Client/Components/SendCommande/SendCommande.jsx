import React, { useState, useEffect , memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './SendCommande.module.css';
import { useTranslation } from 'react-i18next';

const SendCommande = memo(({ previousStep }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

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

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.finalPrice * item.quantity); // Use finalPrice from cart
    }, 0);
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <div className={styles.pageContainer} dir={dir}>
        <div className={styles.invoiceContainer}>
          <h1 className={styles.title}>{t('Order Summary')}</h1>

          {/* Invoice Header */}
          <div className={styles.invoiceHeader}>
            <div className={styles.invoiceRow}>
              <div className={styles.qty}>{t('Qty')}</div>
              <div className={styles.item}>{t('Item')}</div>
              <div className={styles.amount}>{t('Amount')}</div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className={styles.invoiceItems}>
            {isLoading ? (
              <div className={styles.loading}>
                <p>{t('loading_cart')}</p>
              </div>
            ) : cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className={styles.invoiceRow}>
                  <div className={styles.qty}>{item.quantity}x</div>
                  <div className={styles.item}>
                    {item.name || `Item ${item.id}`} {/* Use item name or fallback */}
                  </div>
                  <div className={styles.amount}>
                    ${(item.quantity * item.finalPrice).toFixed(2)} {/* Use finalPrice */}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyCart}>
                <p className={styles.emptyCartText}>{t('Your cart is empty')}</p>
              </div>
            )}
          </div>

          {/* Total */}
          <div className={styles.totalSection}>
            <div className={styles.invoiceRow}>
              <div className={styles.totalLabel}>{t('Total')}</div>
              <div className={styles.totalAmount}>
                ${calculateTotal().toFixed(2)} {/* Display total */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.btnBox}>
        <button className={styles.btn_back} onClick={previousStep}>
          <ArrowLeft /> {t('Previous')}
        </button>

        <button
          className={`${styles.btn_next}`}
          onClick={() => {
            alert('WA Khelsna AZABI');
          }}
          disabled={cart.length === 0} // Disable if cart is empty
        >
          {t('Place Order')}
        </button>
      </div>
    </>
  );
});

export default SendCommande;