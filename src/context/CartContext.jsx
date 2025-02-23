import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { formatPrice } from '../components/FormatPrice/FormatPrice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useClientPreferences } from './OrderFlowContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const { language, setLanguage } = useClientPreferences();


    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Function to add an item to the cart
    const addToCart = useCallback((item) => {
        setCart((prevCart) => {

        //old condition
        // const existingItem = prevCart.find((cartItem) => cartItem.productId === item.id);
        //new condition
        const existingItem = prevCart.find((cartItem) =>
            cartItem.productId === item.id &&
            JSON.stringify(cartItem.supplements) === JSON.stringify(item.supplements || [])
        );

        if (existingItem) {
            const updatedCart = prevCart.map((cartItem) =>
            cartItem.productId === item.id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + item.quantity,
                    total: parseFloat(cartItem.price) * (cartItem.quantity + item.quantity),
                }
                : cartItem
            );

            // Show toast for updated quantity
            const message =
            language === 'en'
                ? `${item.name} quantity updated to ${existingItem.quantity + item.quantity} `
                : language === 'fr'
                ? `Quantité de ${item.name} mise à jour à ${existingItem.quantity + item.quantity} !`
                : `! ${existingItem.quantity + item.quantity} إلى ${item.name} تم تحديث الكمية `;

            toast.success(message, {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { backgroundColor: '#fff', color: '#2d3748' },
            });

            return updatedCart;
        } else {
            const newCart = [
            ...prevCart,
            {
                productId: item.id,
                type: 100,
                quantity: item.quantity,
                price: Number(formatPrice(item.finalPrice)),
                total: Number(formatPrice(item.finalPrice) * Number(item.quantity)),
                name: item.name,
                supplements: item.supplements || [],
            },
            ];

            // Show toast for new item added
            const message =
            language === 'en'
                ? `${item.name} added to cart !`
                : language === 'fr'
                ? `${item.name} ajouté au panier !`
                : `! ${item.name} تم إضافة  إلى السلة`;

            toast.success(message, {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { backgroundColor: '#fff', color: '#2d3748' },
            });

            return newCart;
        }
        });
    }, [language]); 

    const removeFromCart = useCallback((productId, supplements = []) => {
        setCart((prevCart) =>
            prevCart.filter((item) =>
                item.productId !== productId ||
                JSON.stringify(item.supplements) !== JSON.stringify(supplements)
            )
        );
    }, []);
      

    // Function to update the quantity of an item in the cart
    const updateCartItemQuantity = useCallback((productId, newQuantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId
                    ? { 
                        ...item, 
                        quantity: newQuantity,
                        total: parseFloat(item.price) * newQuantity
                    }
                    : item
            )
        );
    }, []);

    return (
        <CartContext.Provider
            value={{ cart, setCart, addToCart, removeFromCart, updateCartItemQuantity }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);