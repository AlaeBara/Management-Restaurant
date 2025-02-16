import React, { useEffect, memo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './SendCommande.module.css';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../../context/CartContext';
import { formatPrice } from '../../../../components/FormatPrice/FormatPrice';
import { useSendOrder } from '../../../../Hooks/SendOrder/useSendOrder';
import { useNavigate } from 'react-router-dom';

const SendCommande = memo(({ previousStep }) => {
  const { t, i18n } = useTranslation();
  const { cart, setCart } = useCart(); 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart !== undefined) {
      setIsLoading(false);
    }
  }, [cart]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const { sendOrder, loading, error } = useSendOrder();

  const transformCartData = () => {
    const transformedCart = {
      totalAmount: calculateTotal(),
      // numberOfSeats: 4, 
      // totalAditionalPrice: 20.00, 
      tableId: "00955e03-7c92-42ef-94ef-596bb1e68dde", 
      items: cart.map(item => ({
        productId: item.productId,
        type: item.type,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    };
    return transformedCart;
  };


  const handleSendOrder = async () => {
    const orderData = transformCartData();
    const response = await sendOrder(orderData);

    if (response?.status === 201) {
      localStorage.removeItem('cart');
      setCart([]);
      navigate('/commande-succès', { state: { orderDetails: response } });
    }
  };

  return (
    <>
      <div className={styles.pageContainer} dir={dir}>
        <div className={styles.invoiceContainer}>
          <h1 className={styles.title}>{t('Order Summary')}</h1>

          <div className={styles.invoiceHeader}>
            <div className={styles.invoiceRow}>
              <div className={styles.qty}>{t('Qty')}</div>
              <div className={styles.item}>{t('Item')}</div>
              <div className={styles.amount}>{t('Amount')}</div>
            </div>
          </div>

          <div className={styles.invoiceItems}>
            {isLoading ? (
              <div className={styles.loading}>
                <p>{t('loading_cart')}</p>
              </div>
            ) : cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.productId} className={styles.invoiceRow}>
                  <div className={styles.qty}>{item.quantity}x</div>
                  <div className={styles.item}>
                    {item.name || `Item ${item.productId}`} 
                  </div>
                  <div className={styles.amount}>
                    {formatPrice(item.total)} Dh
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyCart}>
                <p className={styles.emptyCartText}>{t('Your cart is empty')}</p>
              </div>
            )}
          </div>

          <div className={styles.totalSection}>
            <div className={styles.invoiceRow}>
              <div className={styles.totalLabel}>{t('Total')}</div>
              <div className={styles.totalAmount}>
                {formatPrice(calculateTotal())} Dh
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btnBox}>
        <button className={styles.btn_back} onClick={previousStep}>
          <ArrowLeft /> {t('Previous')}
        </button>

        <button
          className={`${styles.btn_next} ${loading ? styles.disabled : ''}`}
          onClick={handleSendOrder}
          disabled={cart.length === 0 || loading} 
        >
          {loading  ? t('sending_order') : t('Place Order')}
        </button>
      </div>
    </>
  );
});

export default SendCommande;