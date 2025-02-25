import React, { useState } from 'react';
import ImageSlider from './ImageSlider';
import { ShoppingBasket, Plus, Minus } from 'lucide-react';
import styles from './Produit.module.css';


const Produit = ({ produit }) => {
    const [quantity, setQuantity] = useState(1); 

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
        setQuantity(quantity - 1);
        }
    };

  return (
    <div className={`${styles.Produit} w-full h-full rounded-lg shadow p-2 flex flex-row sm:flex-col sm:space-y-4`}>
        <div className="w-1/2 flex items-center sm:w-full rounded-lg overflow-hidden">
            <ImageSlider item={produit} />
        </div>
        <div className="w-1/2 sm:w-full flex flex-col justify-between pl-2 sm:pl-0">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">{produit.name}</h3>
                <p className="text-xs text-gray-500">{produit.description}</p>
            </div>

            <div className="mt-4">
                <div className="hidden sm:flex items-center justify-between">
                    <p className="text-lg text-[#2d3748] font-medium">
                        {Number(produit.finalPrice)} MAD
                    </p>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDecrease}
                            className="bg-[#f3f4f6] text-[#2d3748] p-1 rounded-md"
                            title="Decrease quantity"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="text-lg font-medium">{quantity}</span>
                        <button
                            onClick={handleIncrease}
                            className="bg-[#f3f4f6] text-[#2d3748] p-1 rounded-md"
                            title="Increase quantity"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
                {/* Mobile */}
                <div className="sm:hidden">
                    <div className="flex items-center justify-center mb-2">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleDecrease}
                                className="bg-[#f3f4f6] text-[#2d3748] p-1 rounded-md"
                                title="Decrease quantity"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="text-lg font-medium">{quantity}</span>
                            <button
                                onClick={handleIncrease}
                                className="bg-[#f3f4f6] text-[#2d3748] p-1 rounded-md"
                                title="Increase quantity"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    <p className="text-lg text-[#2d3748] font-medium text-center">
                        {Number(produit.finalPrice)} MAD
                    </p>
                </div>
            </div>
            <button
                className="w-full bg-[#f3f4f6] text-[#2d3748] px-3 py-2 rounded-md flex items-center justify-center mt-4"
                title="Ajouter au panier"
            >
                <ShoppingBasket className="mr-2" />  <span className="hidden sm:inline">Ajouter au panier</span>
            </button>
        </div>
    </div>
  );
};

export default Produit;