import React, { useState } from 'react';
import styles from './Dessert.module.css';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ShoppingCart ,ArrowLeft} from 'lucide-react'; 

const Dessert = ({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();

  const menuItems = [
    { id: 1, price: 8.53, image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/1/29/1/FN_Strawberry-Poke-Cake_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1393874276855.jpeg", category: "Lunch" },
    { id: 2, price: 8.53, image: "https://www.allrecipes.com/thmb/FRzTyEYbAi3hJsIctlq8toGKv_A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/hot-fudge-ice-cream-bar-dessert-22728-7a84d325fdd04ccc8976bf1478d8362d.jpg", category: "Breakfast" },
    { id: 3, price: 8.53, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEIT8aOFyZdjlnlr2cTGXcd9rCCitJOueFgQ&s", category: "Dinner" },
    { id: 4, price: 8.53, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcD8iLTRltuuSteoTeswOq6BIWcIncmylw_g&s", category: "Dinner" },
    { id: 5, price: 8.53, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaQk3lRY_GyJPaWzVp2Q-_7BqbgOhijAV7MQ&s", category: "Lunch" },
    { id: 6, price: 8.53, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXTgM7WJhgbFFDj91XvJtxFe7DTBSDCS72DQ&s", category: "Dinner" }
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

        <h1 className={styles.title}>{t('Dessert Menu')}</h1>

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

export default Dessert;
