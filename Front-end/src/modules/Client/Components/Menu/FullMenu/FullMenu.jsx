import React, { useState } from 'react';
import {Plus, Minus, ShoppingCart,ArrowLeft } from 'lucide-react';
import styles from './FullMenu.module.css';
import { useTranslation } from 'react-i18next';

const menuItems = [
  { id: 1, price: 8.53, image: "https://images.deliveryhero.io/image/fd-th/LH/jb7y-listing.jpg", category: "Lunch" },
  { id: 2, price: 8.53, image: "https://w7.pngwing.com/pngs/319/731/png-transparent-cafe-food-barbecue-grill-chicken-dish-grilled-food-animals-seafood-recipe-thumbnail.png", category: "Breakfast" },
  { id: 3, price: 8.53, image: "https://veenaazmanov.com/wp-content/uploads/2017/03/Hyderabad-Chicken-Biryani-Dum-Biryani-Kachi-Biryani4.jpg", category: "Dinner" },
  { id: 4, price: 8.53, image: "https://t3.ftcdn.net/jpg/06/13/11/24/360_F_613112498_iv3eiTNveuJpXjHFGDnClADBmBNGMTVD.jpg", category: "Dinner" },
  { id: 5, price: 8.53, image: "https://www.thespruceeats.com/thmb/9Clboupu2hvMEXks_u3HcNkkNlg=/450x300/filters:no_upscale():max_bytes(150000):strip_icc()/SES-classic-steak-diane-recipe-7503150-hero-01-b33a018d76c24f40a7315efb3b02025c.jpg", category: "Lunch" },
  { id: 6, price: 8.53, image: "https://www.quichentell.com/wp-content/uploads/2020/12/Fish-Pulao-3.1.jpg", category: "Dinner" }
];

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Desserts", "Beverage"];

const Menu = ({previousStep, nextStep}) => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantities, setQuantities] = useState({});

  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleIncrement = (itemId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 1) + 1
    }));
  };

  const handleDecrement = (itemId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: Math.max(1, (prevQuantities[itemId] || 1) - 1)
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    console.log(`Added ${quantity} ${item.name}(s) to cart`);
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <div className={styles.container} dir={dir}>
        <h1 className={styles.title}>{t('title')}</h1>

        <p className={styles.description}>
          {t('description')}
        </p>
        
        <div className={styles.categories}>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {t(`categories.${category.toLowerCase()}`)}
            </button>
          ))}
        </div>
        
        <div className={styles.menuGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.menuItem}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />

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

export default Menu;
