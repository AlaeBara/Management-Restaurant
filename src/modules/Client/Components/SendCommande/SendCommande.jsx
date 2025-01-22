import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './SendCommande.module.css';
import { useTranslation } from 'react-i18next';

const SendCommande = ({ previousStep }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const menuItems = [
    { id: 1, price: 8.53, name: "Chicken Dish", category: "Lunch" },
    { id: 2, price: 8.53, name: "Breakfast Special", category: "Breakfast" },
    { id: 3, price: 8.53, name: "Biryani", category: "Dinner" },
    { id: 4, price: 8.53, name: "Grilled Fish", category: "Dinner" },
    { id: 5, price: 8.53, name: "Steak Diane", category: "Lunch" },
    { id: 6, price: 8.53, name: "Fish Pulao", category: "Dinner" }
  ];

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
      return total + (menuItems[item.id - 1].price * item.quantity);
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
            {cart.map((item) => (
              <div key={item.id} className={styles.invoiceRow}>
                <div className={styles.qty}>{item.quantity}x</div>
                <div className={styles.item}>{menuItems[item.id - 1].name}</div>
                <div className={styles.amount}>
                  ${(item.quantity * menuItems[item.id - 1].price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className={styles.totalSection}>
            <div className={styles.invoiceRow}>
              <div className={styles.totalLabel}>{t('Total')}</div>
              <div className={styles.totalAmount}>
                ${calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Keeping original styling */}
      <div className={styles.btnBox}>
        <button className={styles.btn_back} onClick={previousStep}>
          <ArrowLeft /> {t('Previous')}
        </button>

        <button
          className={`${styles.btn_next}`}
          onClick={()=>{alert("WA Khelsna AZABI")}}
        >
          {t('Place Order')}
        </button>
      </div>
    </>
  );
};

export default SendCommande;