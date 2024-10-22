import React, { useState, useEffect } from 'react';
import styles from './Cart.module.css';
import { useTranslation } from 'react-i18next';
import { Trash, ArrowLeft,Plus, Minus } from 'lucide-react';

const Cart = ({ previousStep , nextStep }) => {
  const { t, i18n } = useTranslation();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const menuItems = [
    { id: 1, price: 8.53, image: "https://images.deliveryhero.io/image/fd-th/LH/jb7y-listing.jpg", category: "Lunch" },
    { id: 2, price: 8.53, image: "https://w7.pngwing.com/pngs/319/731/png-transparent-cafe-food-barbecue-grill-chicken-dish-grilled-food-animals-seafood-recipe-thumbnail.png", category: "Breakfast" },
    { id: 3, price: 8.53, image: "https://veenaazmanov.com/wp-content/uploads/2017/03/Hyderabad-Chicken-Biryani-Dum-Biryani-Kachi-Biryani4.jpg", category: "Dinner" },
    { id: 4, price: 8.53, image: "https://t3.ftcdn.net/jpg/06/13/11/24/360_F_613112498_iv3eiTNveuJpXjHFGDnClADBmBNGMTVD.jpg", category: "Dinner" },
    { id: 5, price: 8.53, image: "https://www.thespruceeats.com/thmb/9Clboupu2hvMEXks_u3HcNkkNlg=/450x300/filters:no_upscale():max_bytes(150000):strip_icc()/SES-classic-steak-diane-recipe-7503150-hero-01-b33a018d76c24f40a7315efb3b02025c.jpg", category: "Lunch" },
    { id: 6, price: 8.53, image: "https://www.quichentell.com/wp-content/uploads/2020/12/Fish-Pulao-3.1.jpg", category: "Dinner" }
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

  const handleDelete = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (itemId, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <div className={styles.container} dir={dir}>
        <h1 className={styles.title}>{t('Your Food Cart')}</h1>
        <div className={styles.cartItems}>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={menuItems[item.id - 1].image} 
                      alt={`Item ${item.id}`}
                      className={styles.itemImage}
                    />
                  </div>
                  <div className={styles.itemDetails}>


                    {/* name and price */}
                    <div className={styles.itemHeader}>
                      <span className={styles.itemCategory}>
                        {menuItems[item.id - 1].category}
                      </span>
                      <span className={styles.itemPrice}>
                        ${menuItems[item.id - 1].price.toFixed(2)}
                      </span>
                    </div>

                    {/* Qty */}

                    <div className={styles.itemHeader}>
                      <span className={styles.itemCategory}>
                        <span className={styles.quantityLabel}>{t('Quantity')}:</span>
                      </span>
                      <span className={styles.itemPrice}>
                        {/* Quantity controls */}
                        <div className={styles.quantityControl}>
                          <button 
                            className={styles.quantityButton} 
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className={styles.iconn} />
                          </button>
                          <span className={styles.quantityValue}>{item.quantity}</span>
                          <button 
                            className={styles.quantityButton} 
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className={styles.iconn} />
                          </button>
                        </div>
                      </span>
                    </div>

                    {/* price *Qty */}
                    <div className={styles.itemHeader}>
                      <span className={styles.itemCategory}>
                        <span className={styles.quantityLabel}>{t('Total')}:</span>
                      </span>
                      <span className={styles.itemPrice}>
                        <span className={styles.quantityValue}>${item.quantity*menuItems[item.id - 1].price.toFixed(1)}</span>
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

      <div className={styles.btnBox}>
        <button className={styles.btn_back} onClick={previousStep}>
          <ArrowLeft />
          {t('Previous')}
        </button>
        
        <button
          className={`${styles.btn_next}`}
          onClick={nextStep}
        >
          {t('Next')}
        </button>
      </div>
    </>
  );
};

export default Cart;