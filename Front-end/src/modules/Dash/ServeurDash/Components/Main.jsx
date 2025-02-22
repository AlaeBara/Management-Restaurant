import React, { useState, useEffect, useRef, memo } from 'react';
import styles from './Main.module.css';
import { useFetchTags } from '../hooks/UseFetcchTags';
import { Loader } from 'lucide-react';
import Produit from './Produit';


const Main = memo(() => {
    const [selectedCategory, setSelectedCategory] = useState('Tous');

    const { tags, Isloading, message, fetchTags } = useFetchTags();
    useEffect(() => {
        fetchTags({fetchAll: true});
    }, []);


    //sroll with wheel of mouse
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
                {Isloading ? 
                    <div className='flex flex-col justify-center items-center h-full'>
                        <Loader className='w-5 h-5 animate-spin' />
                        <p className='text-gray-500'>Chargement des tags...</p>
                    </div>
                    : 
                    <>
                        {message ? (
                            <div className='flex justify-center items-center h-full'>
                                <p className='text-red-500 text-center'>{message}</p>
                            </div>
                        ) : (
                            <>
                                <button className={`${styles.categoryButton} ${selectedCategory === 'Tous' ? styles.active : ''}`} onClick={() => setSelectedCategory('Tous')}>Tous</button>
                                {tags.map((tag) => (
                                    <button key={tag.id} className={`${styles.categoryButton} ${selectedCategory === tag.tag ? styles.active : ''}`} onClick={() => setSelectedCategory(tag.tag)}>
                                        {tag.tag}
                                    </button>
                                ))}
                            </>
                        )}
                    </>
                }
            </div>
        </div>



        {/* Produits */}
        <div className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4'>
            {Array.from({ length: 10 }).map((_, index) => (
                <Produit key={index} />
            ))}
            
        </div>

    </>
  );
});

export default Main;