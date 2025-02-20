import React, { useState, useEffect, useCallback } from 'react';
import styles from './ServeurDash.module.css';
import Cart from './components/Carts'; 

const ServeurDash = () => {
    const [showCart, setShowCart] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Toggle cart visibility
    const toggleCart = useCallback(() => {
        if (isMobile) {
            // Scroll to cart in responsive mode
            const cartSection = document.getElementById('cartSection');
            cartSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            setShowCart((prev) => !prev);
        }
    }, [isMobile]);
    
    // Handle window resize for responsiveness
    useEffect(() => {
        const handleResize = () => {
            const isNowMobile = window.innerWidth <= 768;
            setIsMobile(isNowMobile);
            if (!isNowMobile) {
                setShowCart(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


  return (
    <div className={styles.container}>
        <dir className={`flex flex-col p-0`}>
            <h1 className={`text-2xl font-bold ${styles.typinganimation}`}>Bonjour 👋</h1>
            <p className='text-gray-500'>Vous pouvez gérer facilement les commandes des clients.</p>
        </dir>


        {/* Cart Section */}
        <Cart showCart={showCart} />

        {/* Floating Toggle Button */}
        <button className={styles.toggleButton} onClick={toggleCart}>
            <span role="img" aria-label="cart">🛒</span>
        </button>
    </div>
  );
};

export default React.memo(ServeurDash);