import React, { useEffect, useState } from 'react';
import styles from './Carts.module.css';
import { formatDate } from '@/components/dateUtils/dateUtils';
import { Trash2 } from 'lucide-react';
import { useServeurContext } from '../../../../context/ServeurContext';
import { Loader , Minus, Plus } from 'lucide-react';

const Cart = React.memo(({ showCart }) => {

    const {cart, updateCartItemQuantity, removeFromCart, clearCart} = useServeurContext();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (cart !== undefined) {
          setIsLoading(false);
        }
    }, [cart]);

    // Function to handle quantity changes
    const handleQuantityChange = (productId, change, supplements) => {
        const item = cart.find(
        (item) =>
            item.productId === productId &&
            JSON.stringify(item.supplements) === JSON.stringify(supplements)
        );
        if (item) {
            const newQuantity = Math.max(1, item.quantity + change);
            updateCartItemQuantity(productId, newQuantity, supplements);
        }
    };

    const handleDelete = (productId, supplements) => {
        removeFromCart(productId, supplements); 
    };

    //total order 
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
    };


  return (
    <div id="cartSection" className={`${styles.cartSection} ${showCart ? styles.cartOpen : ''}`}>

        <div className={styles.DivTitle}>
            <h2 className={`text-2xl font-bold ${styles.Title}`}>Commande actuelle</h2>
            <p className='text-ms text-gray-500'>Date : {formatDate(new Date())}</p>
        </div>
      
        <div className={styles.cartItems}>
            <div className="space-y-4 mr-2">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center">
                        <Loader className="h-6 w-6 animate-spin" />
                        <p>Chargement des articles...</p>
                    </div>
                ) : cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={`${item.productId}-${JSON.stringify(item.supplements)}`} className="p-4 border rounded-lg shadow-sm space-y-2">
                            
                            <div className='flex items-center justify-between'>
                                <p className='text-lg font-medium'>{item.name}</p>
                                <button className='text-white bg-red-500 p-1 rounded-md' 
                                    title='Supprimer le produit'
                                    onClick={() => handleDelete(item.productId, item.supplements)}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className='flex items-center justify-between'>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuantityChange(item.productId, -1, item.supplements)
                                        }}
                                        className="border border-gray-200 text-[#2d3748] p-1 rounded-md"
                                        title="Diminuer la quantité"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-lg font-medium">{item.quantity}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuantityChange(item.productId, 1, item.supplements)
                                        }}
                                        className="bg-gray-200 text-[#2d3748] p-1 rounded-md"
                                        title="Augmenter la quantité"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            
                                <p className='text-lg font-medium'>{item.total} Dh</p>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-gray-600">Votre panier est vide</p>
                    </div>
                )}
            </div>
        </div>



        <div className={`${styles.cartSummary} shadow-sm`}>
            <p>Total:</p>
            <p>{calculateTotal()} Dh</p>
        </div>
        


        <div className={styles.DivButton}> 
            <button className={styles.paymentButton}>
                Enregistrer la commande
            </button>
            <button className={styles.CleanButton} onClick={clearCart}>
                <Trash2 />
            </button>
        </div>
    </div>
  );
});

export default Cart;