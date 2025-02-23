import React, { useEffect, memo, useState } from 'react';
import styles from './Cart.module.css';
import { useTranslation } from 'react-i18next';
import { Trash, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useClientPreferences } from '../../../../context/OrderFlowContext';
import { useCart } from '../../../../context/CartContext';
import { Loader } from 'lucide-react';
import { formatPrice } from '../../../../components/FormatPrice/FormatPrice';

const Cart = memo(({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();
  const { language } = useClientPreferences();
  const { cart, removeFromCart, updateCartItemQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cart !== undefined) {
      setIsLoading(false);
    }
  }, [cart]);

  const handleDelete = (productId, supplements) => {
    removeFromCart(productId, supplements);
  };

  const handleQuantityChange = (productId, change) => {
    const item = cart.find((item) => item.productId === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <div className={styles.pageContainer} dir={dir}>
        <div className={styles.invoiceContainer}>
          <h1 className={styles.title}>{t('Your Food Cart')}</h1>

          <div className={styles.invoiceHeader}>
            <div className={styles.invoiceRow}>
              <div className={styles.item}>{t('Item')}</div>
              <div className={styles.qty}>{t('Qty')}</div>
              <div className={styles.amount}>{t('Amount')}</div>
              <div className={styles.actions}>{t('Actions')}</div>
            </div>
          </div>

          <div className={styles.invoiceItems}>
            {isLoading ? (
              <div className={styles.loading}>
                <Loader className="h-6 w-6 animate-spin" />
                <p>{t('loading_cart')}</p>
              </div>
            ) : cart.length > 0 ? (
              cart.map((item) => (
                <div key={`${item.productId}-${JSON.stringify(item.supplements)}`} className={styles.invoiceRow}>
                  <div className={styles.item}>
                    <div className={styles.itemName}>
                      {item.translates?.find((t) => t.languageValue === language)?.name || item.name || 'No Name'}
                    </div>
                    {/* Display Supplements */}
                    {item.supplements && item.supplements.length > 0 && (
                      <div className='flex flex-col gap-2 mt-2'>
                        <p className='text-sm font-semibold'>{t('supplements')}:</p>
                        <ul className='list-disc list-inside'>
                          {item.supplements.map((supplement, index) => (
                            <li key={index} className='text-sm'>
                              {supplement.name} (+{formatPrice(supplement.price)} Dh)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className={styles.qty}>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className={styles.quantityValue}>
                        {item.quantity}
                      </span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.productId, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className={styles.amount}>
                    {formatPrice(item.total)} Dh
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(item.productId, item.supplements)}
                    >
                      <Trash className="w-4 h-4" />
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