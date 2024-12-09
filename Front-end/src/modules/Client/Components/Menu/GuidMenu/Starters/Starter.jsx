import React, { useState } from 'react';
import styles from './Starter.module.css';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ShoppingCart ,ArrowLeft} from 'lucide-react'; 

const Starter = ({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();

  const menuItems = [
    { id: 1, price: 8.53, image: "https://easyfood.ie/wp-content/uploads/2023/11/Smoked-salmon-herby-cream-cheese-bites-featured-770x770.png", category: "Lunch" },
    { id: 2, price: 8.53, image: "https://images.immediate.co.uk/production/volatile/sites/2/2019/08/Olive_Seasonal_ConfitGarlicRoastedTomatoesToast-520c4ab.jpg?quality=90&resize=556,505", category: "Breakfast" },
    { id: 3, price: 8.53, image: "https://images.immediate.co.uk/production/volatile/sites/30/2017/06/Tomato-soup-5cf0912.jpg?quality=90&resize=556,505", category: "Dinner" },
    { id: 4, price: 8.53, image: "https://www.princes.co.uk/wp-content/uploads/sites/14/2024/09/Princes_TunaStuffPotatoSkins_1x1_v01-scaled.jpg.webp", category: "Dinner" },
    { id: 5, price: 8.53, image: "https://img.delicious.com.au/fFU7B22c/w1200/del/2015/10/carrot-tzatziki-15562-2.jpg", category: "Lunch" },
    { id: 6, price: 8.53, image: "https://img.taste.com.au/0rJb9yEE/w354-h236-cfill-q80/taste/2016/11/butter-chicken-vol-au-vents-104157-1.jpeg", category: "Dinner" }
  ];

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  
  // State to manage quantities
  const [quantities, setQuantities] = useState({});

  const handleIncrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const handleDecrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 1) }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
  
    // Retrieve the cart from local storage or initialize an empty array if it doesn't exist
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Check if the item is already in the cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Update the quantity of the existing item
      existingItem.quantity += quantity;
    } else {
      // Add the new item to the cart
      cart.push({ id: item.id, quantity });  // Include the entire item, not just item.id
    }
  
    // Store the updated cart in local storage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    
  };

  return ( 
    <>
      <div className={styles.container} dir={dir}>

        <h1 className={styles.title}>{t('Starters Menu')}</h1>

        {/* <p className={styles.description}>
          {t('description')}
        </p> */}
        
        <div className={styles.menuGrid}>
          {menuItems.map((item) => (
            <div key={item.id} className={styles.menuItem}>
              <img src={item.image} alt={t(`items.${item.id}`)} className={styles.itemImage} />

              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{t(`items.${item.id}`)}</h3>

                <div className={styles.ratingContainer}>
                  <p>{t('description')}</p>
                </div>

                <div className={styles.priceAndCart}>
                  <span className={styles.price}>${item.price.toFixed(2)}</span>

                  <div className={styles.quantityAndCart}>
                    <div className={styles.quantityControl}>
                      <button className={styles.quantityButton} onClick={() => handleDecrement(item.id)}>
                        <Minus className={styles.icon} />
                      </button>

                      <span className={styles.quantityDisplay}>
                        {quantities[item.id] || 1}
                      </span>

                      <button className={styles.quantityButton} onClick={() => handleIncrement(item.id)}>
                        <Plus className={styles.icon} />
                      </button>
                    </div>

                    <button className={styles.addToCartButton} onClick={() => handleAddToCart(item)}>
                      <ShoppingCart className={styles.icon} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
        >
          {t('Next')}
        </button>
      </div>
    </>
  );
};

export default Starter;
