import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Function to add an item to the cart
    const addToCart = useCallback((item) => {
        setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
            return prevCart.map((cartItem) =>
            cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            );
        } else {
            return [...prevCart, item];
        }
        });
    }, []);

    // Function to remove an item from the cart
    const removeFromCart = useCallback((itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    }, []);

    // Function to update the quantity of an item in the cart
    const updateCartItemQuantity = useCallback((itemId, newQuantity) => {
        setCart((prevCart) =>
        prevCart.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
        );
    }, []);


    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateCartItemQuantity }}
        >
        {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);