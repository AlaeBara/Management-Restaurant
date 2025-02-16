import React, {memo} from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import styles from '../../modules/Client/Components/Menu/FullMenu/FullMenu.module.css';
import ImageSlider from '../imageSlider/ImageSlider';
import { formatPrice } from '../FormatPrice/FormatPrice';

const Produits = memo(({ produits, language, quantities, handleIncrement, handleDecrement, handleAddToCart, handleProductClick }) => {
  return produits.map((item) => (

    <div key={item.id} className={styles.menuItem} onClick={() => handleProductClick(item)}>
        
        <ImageSlider item={item} />
        
        <div className={styles.itemInfo}>

            {item.discountLevel === "basic" && 
                <div className={styles.promo}>
                   <p>{item.discountMethod === "percentage" ? <>-{Number(item.discountValue)}%</> :<>-{Number(item.discountValue)}DH</> }</p>
                </div>
            }
            
            {
                item.discountLevel === "advanced" &&
                item.discount.status !== "noDiscount" && (
                    <div className={styles.promo}>
                       <p>{item.discountMethod === "percentage" ? <>-{Number(item.discountValue)}%</> :<>-{Number(item.discountValue)}DH</> }</p>
                    </div>
                )
            }

            <h3 className={styles.itemName}>
                {item.translates.find((t) => t.languageValue === language)?.name || item.name}
            </h3>

            <div className={styles.ratingContainer}>
                <p>{item.translates.find((t) => t.languageValue === language)?.description || item.description}</p>
            </div>

            <div>
                <span className={styles.price}>
                    {formatPrice(item.finalPrice)} Dh
                    {item.finalPrice !== item.basePrice && (
                        <span className={styles.oldPrice}>{formatPrice(item.basePrice)} Dh</span>
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
});

export default Produits;