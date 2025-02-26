import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatPrice } from '../components/FormatPrice/FormatPrice';


const ServeurContext = createContext();

export const ServeurProvider = ({ children }) => {

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
            const message =`Quantité de ${item.name} mise à jour à ${existingItem.quantity + item.quantity} !`

            toast.success(message, {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { backgroundColor: '#fff', color: '#2d3748' },
            });

            return updatedCart;
        } 
        
        else {
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
            const message =`${item.name} ajouté au panier !`
            
            toast.success(message, {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { backgroundColor: '#fff', color: '#2d3748' },
            });
            console.log(newCart);
            return newCart;
        }
        });
    }, []); 

    const removeFromCart = useCallback((productId, supplements = []) => {
        setCart((prevCart) =>
            prevCart.filter((item) =>
                item.productId !== productId ||
                JSON.stringify(item.supplements) !== JSON.stringify(supplements)
            )
        );
    }, []);
      
    // Function to update the quantity of an item in the cart
    const updateCartItemQuantity = useCallback((productId, newQuantity, supplements) => {
        setCart((prevCart) =>
        prevCart.map((item) =>
            item.productId === productId &&
            JSON.stringify(item.supplements) === JSON.stringify(supplements)
            ? {
                ...item,
                quantity: newQuantity,
                total: parseFloat(item.price) * newQuantity,
                }
            : item
        )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    return (
        <ServeurContext.Provider
            value={{ cart, setCart, addToCart, removeFromCart, updateCartItemQuantity, clearCart }}
        >
            {children}
        </ServeurContext.Provider>
    );
};

export const useServeurContext = () => useContext(ServeurContext);