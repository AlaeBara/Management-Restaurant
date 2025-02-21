import React, { useState, useEffect, useRef, memo } from 'react';
import styles from './Main.module.css';

const Main = memo(() => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categoriesRef = useRef(null);

    useEffect(() => {
        const categoriesContainer = categoriesRef.current;
        const handleWheel = (event) => {
        if (event.deltaY !== 0) {
            event.preventDefault();
            categoriesContainer.scrollBy({
            left: event.deltaY < 0 ? -250 : 250,
            behavior: 'smooth',
            });
        }
        };

        if (categoriesContainer) {
        categoriesContainer.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (categoriesContainer) {
                categoriesContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

  return (
    <>

        {/* Tags */}
        <div className={`${styles.container} grid grid-cols-1`}>
            <div className={`${styles.categories}`} ref={categoriesRef}>
                {Array.from({ length: 20 }).map((_, index) => (
                    <button key={index} className={`${styles.categoryButton}`}>
                        Tous
                    </button>
                ))}
            </div>
        </div>

        {/* Produits */}

    </>
  );
});

export default Main;