import React, { useState, memo } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import ImageSlider from '../imageSlider/ImageSlider';
import style from './PopUpProducts.module.css'

const PopUpProduct = memo(({ product, onClose, language }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSupplements, setSelectedSupplements] = useState([]);

  // Static data for supplements (replace with dynamic data later)
  const supplements = [
    { id: 1, name: 'Extra Cheese', price: 5 },
    { id: 2, name: 'Bacon', price: 7 },
    { id: 3, name: 'Mushrooms', price: 3 },
  ];

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

  const handleAddToCartClick = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      finalPrice: product.finalPrice,
      quantity,
    };

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...currentCart, cartItem];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4`}>
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
          <h2 className="text-xl font-bold mb-4">
            {product.translates.find((t) => t.languageValue === language)?.name || 'No Name'}
          </h2>
          <p className="text-gray-600 mb-4 ">
            {product.translates.find((t) => t.languageValue === language)?.description || 'No Description'}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-lg font-semibold">
              {product.finalPrice} Dh
            </span>
            {product.finalPrice !== product.basePrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.basePrice} Dh
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
            <h3 className="text-lg font-semibold mb-4">Supplements</h3>
            <div className="max-h-40 overflow-y-auto scrollbar-hide">
              {supplements.map((supplement) => (
                <label
                  key={supplement.id}
                  className="flex items-center justify-between p-3 border rounded-lg mb-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSupplements.includes(supplement.id)}
                      onChange={() => handleSupplementChange(supplement.id)}
                      className={`w-4 h-4 ${style.radioInput}`}
                    />
                    <span>{supplement.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">+{supplement.price} Dh</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Add to Cart Button */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <button
            className="w-full bg-[#0C5800] text-white py-3 rounded-lg hover:bg-[#245e48] transition-colors shadow-lg"
            onClick={handleAddToCartClick}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

export default PopUpProduct;