import React, { useEffect, memo, useState } from 'react';
import styles from './Cart.module.css';
import { useTranslation } from 'react-i18next';
import { Trash, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useClientPreferences } from '../../../../context/OrderFlowContext';
import { useCart } from '../../../../context/CartContext'; 
import { Loader } from 'lucide-react';

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

  // Function to handle quantity changes
  const handleQuantityChange = (productId, change, supplements) => {
    const item = cart.find(
      (item) =>
        item.productId === productId &&
        JSON.stringify(item.supplements) === JSON.stringify(supplements)
    );
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateCartItemQuantity(productId, newQuantity, supplements);
    }
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';


  return (
    <>
      <div className={styles.container} dir={dir}>
        <h1 className={styles.title}>{t('Your Food Cart')}</h1>

        <div className="space-y-4">
          {isLoading ? (
            <div className="mt-[20vh] flex flex-col justify-center items-center">
              <Loader className="h-6 w-6 animate-spin" />
              <p>{t('loading_cart')}</p>
            </div>
          ) : cart.length > 0 ? (
            cart.map((item) => (
              <div key={`${item.productId}-${JSON.stringify(item.supplements)}`} className="p-4 border rounded-lg shadow-sm">
                <div className="flex justify-between items-start">

                  {/* Item Name and Price */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {item.translates?.find((t) => t.languageValue === language)?.name || item.name || 'No Name'}
                    </h2>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.productId, item.supplements)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-6 w-6" />
                  </button>
                </div>

                {/* Supplements */}
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">{t('supplements')}:</p>
                  <div className="text-sm text-gray-600  flex flex-wrap gap-2 ">
                    {item.supplements && item.supplements.length > 0 ? (
                      item.supplements.map((supplement, index) => (
                        <span key={supplement.id}>
                          ({supplement.name} - {supplement.price} Dh)
                          {index < item.supplements.length - 1 ? <span className="text-gray-600 ml-2">-</span> : ''}   
                        </span>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium">{t('Quantity')}:</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, -1, item.supplements)}
                      disabled={item.quantity <= 1}
                      className="p-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, 1, item.supplements)}
                      className="p-1 border rounded-md  hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

    
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium mb-2">{t('Total')}:</p>
                  <p className="text-xl font-bold text-gray-600">{item.total} Dh</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-600">{t('Your cart is empty')}</p>
            </div>
          )}
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