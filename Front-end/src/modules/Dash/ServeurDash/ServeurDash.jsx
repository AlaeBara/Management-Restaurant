import React, { useState, useEffect, useCallback } from 'react';
import styles from './ServeurDash.module.css';
import Cart from './components/Carts'; 
import { X, ShoppingBasket, MoveUp } from 'lucide-react';
import Main from './components/Main';
import {Input}from '@/components/ui/input';
import {Search}from 'lucide-react';


const ServeurDash = () => {
    const [showCart, setShowCart] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isInCarts, setIsInCarts] = useState(false);

    const toggleCart = useCallback(() => {
        const cartSection = document.getElementById('cartSection');
        if (isMobile && cartSection) {
            const cartRect = cartSection.getBoundingClientRect();
            const isInCart = cartRect.top < window.innerHeight && cartRect.bottom > 0;
            if (isInCart) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsInCarts(false);
            } else {
                cartSection.scrollIntoView({ behavior: 'smooth' });
                setIsInCarts(true);
            }
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
        <dir className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-0 m-0`}>
            <div>
                <h1 className={`text-2xl font-bold ${styles.typinganimation}`}>Bonjour 👋</h1>
                <p className='text-gray-500'>Vous pouvez gérer facilement les commandes des clients.</p>
            </div>

            <div className="flex justify-center sm:justify-end">
                <div className="relative mt-3 max-w-[400px] w-full">
                    <Search className="absolute left-3  top-2.5  h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Cherchez quelque chose dont vous avez besoin"
                        className="pl-10"
                    />
                </div>
            </div>
        </dir>

        <Main />
        
        {/* Cart Section */}
        <Cart showCart={showCart} />

        {/* Floating Toggle Button */}
        <button className={`${styles.toggleButton} ${showCart ? styles.toggleButtonActive : ''}`} onClick={toggleCart}>
            <span role="img" aria-label="cart">
                {isInCarts ? <MoveUp /> : showCart ? <X /> : <ShoppingBasket /> }
            </span>
        </button>
    </div>
  );
};

export default React.memo(ServeurDash);