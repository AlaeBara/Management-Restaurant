import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import styles from './FullMenu.module.css';
import { useTranslation } from 'react-i18next';
import { Loader, AlertCircle, AlertTriangle } from 'lucide-react';
import { useClientPreferences } from '../../../../../context/OrderFlowContext';
import { useFetchTags } from '../../../../../Hooks/Tags/useFetchTags';
import { useFetchProduits } from '../../../../../Hooks/Products/useFetchProducts';
import ImageSlider from '../../../../../components/imageSlider/ImageSlider';
import PopUpProduct from '../../../../../components/PopUpProducts/PopUpProduct';


const Menu = memo(({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();
  const { language } = useClientPreferences();

  const { tags, totalTags, Isloading, message, fetchTags } = useFetchTags();
  const { produits, totalProduits, Isloading: laoding_Produits, message: msg_Prouits, fetchProduits } = useFetchProduits();

  useEffect(() => {
    fetchTags({ fetchAll: true });
    fetchProduits({ fetchAll: true });
  }, [fetchTags, fetchProduits]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState({});
  const categoriesRef = useRef(null);

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

  // Filter using tags
  const filteredItems = useMemo(() => {
    return selectedCategory === 'All'
      ? produits
      : produits.filter((item) => item.tags?.some((tag) => tag.tag === selectedCategory));
  }, [produits, selectedCategory]);

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

  const handleAddToCart = useCallback(
    (item) => {
      const quantity = quantities[item.id] || 1;
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existingItem = cart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          name: item.translates?.find((t) => t.languageValue === language)?.name || item.name || 'No Name',
          id: item.id,
          quantity: quantity,
          finalPrice: item.price?.finalPrice || 0,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      console.log(`Added ${quantity} ${item.category}(s) to cart`);
    },
    [quantities, language]
  );

  const [selectedProduct, setSelectedProduct] = useState(null);

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
        className={`${styles.categoryButton} ${selectedCategory === category.tag ? styles.active : ''}`}
        onClick={() => setSelectedCategory(category.tag)}
      >
        {category.tag}
      </button>
    ));
  }, [tags, selectedCategory]);

  // Memoized rendered menu items
  const renderedMenuItems = useMemo(() => {
    return filteredItems.map((item) => (
      <div key={item.id} className={styles.menuItem} onClick={() => handleProductClick(item)}>
        <ImageSlider item={item} />
        <div className={styles.itemInfo}>
          {item.finalPrice !== item.basePrice ? (
            <span className={styles.promo}>
              - {Math.round(((item.basePrice - item.finalPrice) / item.basePrice) * 100)}%
            </span>
          ) : (
            <span aria-hidden="true">&nbsp;</span>
          )}
          <h3 className={styles.itemName}>
            {item.translates.find((t) => t.languageValue === language)?.name || 'No Name'}
          </h3>
          <div className={styles.ratingContainer}>
            <p>{item.translates.find((t) => t.languageValue === 'fr')?.description || 'No Description'}</p>
          </div>
          <div>
            <span className={styles.price}>
              {item.finalPrice}Dh
              {item.finalPrice !== item.basePrice && (
                <span className={styles.oldPrice}>{item.basePrice} Dh</span>
              )}
            </span>
          </div>
          <div className={styles.priceAndCart}>
            <div className={styles.quantityControl}>
              <button className={styles.quantityButton} onClick={(e) => { e.stopPropagation(); handleDecrement(item.id); }}>
                <Minus className={styles.icon} />
              </button>
              <span className={styles.quantityDisplay}>{quantities[item.id] || 1}</span>
              <button className={styles.quantityButton} onClick={(e) => { e.stopPropagation(); handleIncrement(item.id); }}>
                <Plus className={styles.icon} />
              </button>
            </div>
            <button className={styles.addToCartButton} onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}>
              <ShoppingCart className={styles.icon} />
            </button>
          </div>
        </div>
      </div>
    ));
  }, [filteredItems, language, quantities, handleIncrement, handleDecrement, handleAddToCart]);

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';


  
  return (
    <>
      <div className={styles.container} dir={dir}>
        <h1 className={styles.title}>{t('full_menu_title')}</h1>
        <p className={styles.description}>{t('full_menu_description')}</p>

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
        {laoding_Produits ? (
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
              <div className="mt-[20vh] flex flex-col items-center justify-center text-red-500 text-center">
                <AlertTriangle className="h-12 w-12 mb-4 text-red-500" />
                {t('CategorieVide')}
              </div>
            ) : (
              <div className={styles.menuGrid}>{renderedMenuItems}</div>
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

export default Menu;