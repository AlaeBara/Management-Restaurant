import React, { useState, memo } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import ImageSlider from './imageSliderForPopUp';
import style from './PopUpProducts.module.css';
import { useCart } from '../../context/CartContext'; 
import { formatPrice } from '../FormatPrice/FormatPrice';
import { ShoppingBasket } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const PopUpProduct = memo(({ product, onClose, language }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSupplements, setSelectedSupplements] = useState([]);
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleSupplementChange = (supplementId) => {
    setSelectedSupplements((prev) =>
      prev.includes(supplementId)
        ? prev.filter((id) => id !== supplementId)
        : [...prev, supplementId]
    );
  };

  const { groupedChoices } = product;

  const handleAddToCartClick = () => {
    // Calculate the total price of selected supplements
    const supplementsTotal = selectedSupplements.reduce((total, supplementId) => {
      const supplement = Object.values(product.groupedChoices || {})
        .flat()
        .find((choice) => choice.id === supplementId);
      return total + (supplement ? parseFloat(supplement.additionalPrice) : 0);
    }, 0);

    // Create the cart item with supplements data
    const cartItem = {
      id: product.id,
      name: product.translates.find((t) => t.languageValue === language)?.name || product.name,
      finalPrice: parseFloat(product.finalPrice) + supplementsTotal,
      quantity,
      supplements: selectedSupplements.map((supplementId) => {
        const supplement = Object.values(product.groupedChoices || {})
          .flat()
          .find((choice) => choice.id === supplementId);
        return supplement
          ? { id: supplement.id, name: supplement.value, price: parseFloat(supplement.additionalPrice) }
          : null;
      }).filter(Boolean),
    };

    // Add the item to the cart using the context function
    addToCart(cartItem);

    // Close the popup
    // onClose();
  };

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4`} dir={dir}>
      <div className={`bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative flex flex-col shadow-2xl ${style.scrollbarcustom}`}>
        
        {/* Fixed close btn and Product Image */}
        <div className="sticky top-0 bg-white z-40">
          <button
            className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 z-50"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-full flex justify-center p-4">
            <div className="w-full h-full overflow-hidden rounded-lg shadow-md">
              <ImageSlider item={product} />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="px-6 flex-1">
          <h2 className="text-xl font-medium mb-1">
            {product.translates.find((t) => t.languageValue === language)?.name || product.name}
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            {product.translates.find((t) => t.languageValue === language)?.description || product.description}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-lg font-semibold text-[#2d3748]">
              {formatPrice(product.finalPrice)} Dh
            </span>
            {product.finalPrice !== product.basePrice && (
              <span className="text-sm text-gray-500 font-semibold line-through">
                {formatPrice(product.basePrice)} Dh
              </span>
            )}
          </div>

          {/* Quantity Control */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={handleDecrement}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={handleIncrement}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Supplements Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">{t('supplements')}</h3>
            {!groupedChoices || Object.keys(groupedChoices).length === 0 ? (
              <p className="text-gray-500 text-center">{t('noSupplements')}</p>
            ) : (
              <div className={`max-h-40 overflow-y-auto ${style.scrollbarcustom}`}>
                {Object.entries(groupedChoices).map(([groupName, choices]) => (
                  <div key={groupName} className="mb-4">
                    <p className="text-sm  mb-2">{groupName}</p>
                    {choices.map((choice) => (
                      <label
                        key={choice.id}
                        className="flex items-center justify-between p-3 border rounded-lg  hover:bg-gray-50 transition-colors m-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSupplements.includes(choice.id)}
                            onChange={() => handleSupplementChange(choice.id)}
                            className="w-4 h-4 accent-[#2d3748] border-gray-300"
                          />
                          <span>{choice.value}</span>
                        </div>
                        <span className="text-sm text-gray-600">+{choice.additionalPrice} Dh</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>




        {/* Fixed Add to Cart Button */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <button
            className="flex items-center justify-center w-full bg-[#2d3748] text-white py-3 rounded-lg transition-colors shadow-lg"
            onClick={handleAddToCartClick}
          >
            <ShoppingBasket className="mr-2" /> {t('Add to Cart')}
          </button>
        </div>
      </div>
    </div>
  );
});

export default PopUpProduct;