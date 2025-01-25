import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import styles from './FullMenu.module.css';
import { useTranslation } from 'react-i18next';
import { Loader } from "lucide-react";
import { useClientPreferences } from '../../../../../context/OrderFlowContext';
//hooks
import {useFetchTags} from '../../../../../Hooks/Tags/useFetchTags'
import {useFetchProduits} from '../../../../../Hooks/Products/useFetchProducts'

const Menu = ({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();
  const { language } = useClientPreferences();

  console.log(language )
  const { tags, totalTags, Isloading, message, fetchTags } = useFetchTags();

  const { produits, totalProduits, Isloading:laoding_Produits, message:msg_Prouits, fetchProduits }= useFetchProduits()

  useEffect(() => {
    fetchTags({ fetchAll: true });
    fetchProduits({fetchAll: true})
  }, [fetchTags]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantities, setQuantities] = useState({});
  const categoriesRef = useRef(null);



  //for scroll in tags
  useEffect(() => {
    const categoriesContainer = categoriesRef.current;

    const handleWheel = (event) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        categoriesContainer.scrollBy({
          left: event.deltaY < 0 ? -250 : 250, 
          behavior: 'smooth',
        });
      }
    };
    if (categoriesContainer) {
      categoriesContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (categoriesContainer) {
        categoriesContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);


  //filter using tags
  const filteredItems = selectedCategory === "All"
    ? produits
    : produits.filter(item => item.tags[0] === selectedCategory);






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
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: item.id, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(`Added ${quantity} ${item.category}(s) to cart`);
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <div className={styles.container} dir={dir}>
        <h1 className={styles.title}>{t('title')}</h1>

        <p className={styles.description}>
          {t('description')}
        </p>

        {/* Categories Section */}
        {Isloading ? (
          <div className="mb-9 flex flex-col justify-center items-center">
            <Loader className="h-6 w-6 animate-spin" />
            <span className="ml-2">Chargement des Catégories...</span>
          </div>
        ) : message ? (
          <div className="mb-9 text-red-500 text-center">Error : {message}</div>
        ) : (
          <div className={styles.categories} ref={categoriesRef}>
            <button
                className={`${styles.categoryButton} ${selectedCategory === 'All' ? styles.active : ''}`}
                onClick={() => setSelectedCategory("All")}
              >
                All
            </button>
            {tags.map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${selectedCategory === category.tag ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category.tag)}
              >
                {category.tag}
              </button>
            ))}
          </div>
        )}







        {/* Menu Grid */}
        <div className={styles.menuGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.menuItem}>
             <img
                src={
                  item.images[0]?.localPath
                    ? `http://localhost:3000${item.images[0].localPath}`
                    : "https://cdn-icons-png.flaticon.com/512/1046/1046874.png"
                }
                alt={item.translates.find((t) => t.languageValue === 'fr')?.name || 'No Name'}
                className={styles.itemImage}
              />

              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>
                  {item.translates.find((t) => t.languageValue === language )?.name || 'No Name'}
                </h3>

                <div className={styles.ratingContainer}>
                  <p> {item.translates.find((t) => t.languageValue === 'fr')?.description || 'No Description'}</p>
                </div>

                <div className={styles.priceAndCart}>
                  <span className={styles.price}>${item.price.finalPrice}</span>

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