import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './Starter.module.css';
import { useTranslation } from 'react-i18next';
import { Loader, AlertCircle, SearchX } from 'lucide-react';
//hooks
import { useClientPreferences } from '../../../../../../context/OrderFlowContext';
import { useFetchTags } from '../../../../../../Hooks/Tags/useFetchTags';

import { useFetchProduits } from '../../../../../../Hooks/Products/useFetchProducts';
import {useFetchProduitsByTag} from '../../../../../../Hooks/Products/useFetchProductByTag';
//components
import PopUpProduct from '../../../../../../components/PopUpProducts/PopUpProduct';
import Produits from '../../../../../../components/Produit/Produits';
//state golabl
import { useCart } from '../../../../../../context/CartContext';
// Toastify
import {ToastContainer } from 'react-toastify';



const Starter = memo(({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();
  const { language } = useClientPreferences();

  const { tags , Isloading , message, fetchTags } = useFetchTags();
  const { produits, laoding_Produits, msg_Prouits, fetchProduits } = useFetchProduits();
  const {produitsByTag,  isLoading, fetchProduitsByTag} = useFetchProduitsByTag();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState({});
  const categoriesRef = useRef(null);

  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState(null);

  //for fetch tags and produits
  useEffect(() => {
    fetchTags({ fetchAll: true });
    fetchProduits();
  }, [fetchTags, fetchProduits]);

  // Scroll in tags
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

  // Fetch products by tag when a category is selected
  useEffect(() => {
    if (selectedCategory !== 'All') {
      fetchProduitsByTag(selectedCategory);
    }
  }, [selectedCategory, tags, fetchProduitsByTag]);

  // Filter using tags
  const filteredItems = useMemo(() => {
    return selectedCategory === 'All' ? produits || [] : produitsByTag || [];
  }, [produits, produitsByTag, selectedCategory]);


  // Memoized event handlers
  const handleIncrement = useCallback((itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 1) + 1,
    }));
  }, []);
  const handleDecrement = useCallback((itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max(1, (prevQuantities[itemId] || 1) - 1),
    }));
  }, []);

  
   
  const handleAddToCart = useCallback((item) => {
    const quantity = quantities[item.id] || 1;

    const cartItem = {
      name: item.translates?.find((t) => t.languageValue === language)?.name || item.name || 'No Name',
      id: item.id,
      quantity: quantity,
      finalPrice: item.finalPrice || 0,
    };

    addToCart(cartItem); // Use the context function to add the item to the cart
  }, [addToCart, quantities, language]);


  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  // Memoized rendered tags
  const renderedTags = useMemo(() => {
    return tags.map((category) => (
      <button
        key={category.id}
        className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
        onClick={() => setSelectedCategory(category.id)}
      >
        {category.tag}
      </button>
    ));
  }, [tags, selectedCategory]);

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <div className={styles.container} dir={dir}>
        <ToastContainer />
        <h1 className={styles.title}>{t('Starters Menu')}</h1>

        {/* Categories Section */}
        {Isloading ? (
          <div className="mb-9 flex flex-col justify-center items-center">
            <Loader className="h-6 w-6 animate-spin" />
            <span className="ml-2">{t('loading_categories')}</span>
          </div>
        ) : message ? (
          <div className="mb-9 text-red-500 text-center">{t('error_loading_categories')}</div>
        ) : (
          <div className={styles.categories} ref={categoriesRef}>
            <button
              className={`${styles.categoryButton} ${selectedCategory === 'All' ? styles.active : ''}`}
              onClick={() => setSelectedCategory('All')}
            >
              {t('all')}
            </button>
            {renderedTags}
          </div>
        )}

        {/* Menu Grid */}
        {laoding_Produits || isLoading  ? (
          <div className="mt-[20vh] flex flex-col justify-center items-center">
            <Loader className="h-6 w-6 animate-spin" />
            <span className="ml-2">{t('loading_menu_items')}</span>
          </div>
        ) : msg_Prouits ? (
          <div className="mt-[20vh] flex flex-col items-center justify-center text-red-500 text-center">
            <AlertCircle className="h-8 w-8 mb-2" />
            {t('error_loading_menu_items')}
          </div>
        ) : (
          <div>
            {filteredItems.length === 0 ? (
              <div className="mt-[20vh] flex flex-col items-center justify-center text-[#2d3748] text-center">
                <SearchX className="h-12 w-12 mb-4 text-[#2d3748]" />
                {t('CategorieVide')}
              </div>
            ) : (
              <div className={styles.menuGrid}>
                <Produits
                  produits={filteredItems}
                  language={language}
                  quantities={quantities}
                  handleIncrement={handleIncrement}
                  handleDecrement={handleDecrement}
                  handleAddToCart={handleAddToCart}
                  handleProductClick={handleProductClick}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {selectedProduct && (
        <PopUpProduct product={selectedProduct} onClose={handleClosePopup}  language={language} />
      )}

      {/* Fixed Navigation Buttons */}
      <div className={styles.btnBox}>
        <button className={styles.btn_back} onClick={previousStep}>
          <ArrowLeft /> {t('Previous')}
        </button>
        <button className={styles.btn_next} onClick={nextStep}>
          {t('Next')}
        </button>
      </div>
    </>
  );
});

export default Starter;