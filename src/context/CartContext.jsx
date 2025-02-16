import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { formatPrice } from '../components/FormatPrice/FormatPrice';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    
    
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
            const existingItem = prevCart.find((cartItem) => cartItem.productId === item.id);

            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.productId === item.id
                        ? { 
                            ...cartItem, 
                            quantity: cartItem.quantity + item.quantity,
                            total: parseFloat(cartItem.price) * (cartItem.quantity + item.quantity)
                        }
                        : cartItem
                );
            } else {
                return [
                    ...prevCart, 
                    { 
                        productId: item.id, 
                        type: 100, 
                        quantity: item.quantity, 
                        price: Number(formatPrice(item.finalPrice)),
                        total: Number(formatPrice(item.finalPrice) * Number(item.quantity)) ,
                        name: item.name 
                    }
                ];
            }
        });
    }, []);

    // Function to remove an item from the cart
    const removeFromCart = useCallback((productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
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