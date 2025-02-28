import React, { useEffect, useState } from 'react';
import styles from './Carts.module.css';
import { formatDate } from '@/components/dateUtils/dateUtils';
import { useServeurContext } from '../../../../context/ServeurContext';
import { Loader , Minus, Plus , Trash2, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSendOrder } from '../hooks/UseSendOrder';
import { toast } from 'react-toastify';
import image from './tablesimage.png'


const Cart = React.memo(({ showCart  , tables}) => {

    const {cart, updateCartItemQuantity, removeFromCart, clearCart ,setCart} = useServeurContext();
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const [orderNote, setOrderNote] = useState('');

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


    //send order

    const { loading, error, sendOrder } = useSendOrder();

    const transformCartData = () => {
        const transformedCart = {
            totalAmount: calculateTotal(),
            // numberOfSeats: 4, 
            // totalAditionalPrice: 20.00, 
            tableId: tableNumber || null, 
            items: cart.map(item => ({
                productId: item.productId,
                type: item.type,
                menuItemChoices: item.supplements.map(supplement => supplement.id),
                quantity: item.quantity,
                price: item.price,
                total: item.total
            }))
        };
        return transformedCart;
    };

    const handleSendOrder = async () => {
        const orderData = transformCartData();
        const { response, error: sendOrderError } = await sendOrder(orderData);
       
        if (response?.status === 201) {
            if (localStorage.getItem('cart')) {
                localStorage.removeItem('cart');
            }
            toast.success('Commande enregistrée avec succès' , {
                position: "top-right",
                autoClose: 1200,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setCart([]);
            setTableNumber('');
        }
        else {
            toast.error(sendOrderError, {
                position: "top-right",
                autoClose: 1200,
            });
        }
    };


    

  return (

    <>
        <div id="cartSection" className={`${styles.cartSection} ${showCart ? styles.cartOpen : ''}`}>

            <div className={`${styles.DivTitle}`}>
                <h2 className={`text-2xl font-bold ${styles.Title}`}>Commande actuelle</h2>
                <p className='text-ms text-gray-500'>Date : {formatDate(new Date())}</p>
            </div>
        
            <div className={styles.cartItems}>
                <div className="space-y-2 my-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
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

                                {/* Supplements */}
                                {item.supplements.length > 0 && (
                                    <>
                                        {/* <p className="text-xs font-medium">Suppléments:</p> */}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {item.supplements.map((supplement) => (
                                            <Badge key={supplement.id} variant="outline" className="text-xs rounded-full">
                                                {supplement.name}
                                                {supplement.price > 0 && ` (+${supplement.price} Dh)`}
                                            </Badge>
                                            ))}
                                        </div>
                                    </>
                                )}

                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <Receipt className="h-12 w-12 mb-2 opacity-20" />
                            <p>Le panier est vide</p>
                        </div>
                    )}
                </div>
            </div>



            <div className={`${styles.cartSummary}`}>
                <p>Total:</p>
                <p>{calculateTotal()} Dh</p>
            </div>


            <div className={`${styles.boxInputs}  flex justify-center  my-2`}>
                <Button variant="outline" className='w-fit' onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> 
                    <p>Ajouter la table ou la note</p>
                </Button>
            </div>


            <div className={styles.DivButton}> 
                <button className={`${styles.paymentButton} ${loading || cart.length === 0 ? '!cursor-not-allowed opacity-50' : ''}`} onClick={handleSendOrder} disabled={loading || cart.length === 0}>
                    {loading ? <Loader className="h-6 w-6 animate-spin" /> : 'Enregistrer la commande'}
                </button>

                <button className={styles.CleanButton} onClick={() => {clearCart(); setTableNumber('')}}>
                    <Trash2 />
                </button>
            </div>
        </div>



        {isModalOpen && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                <div 
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={() => setIsModalOpen(false)}
                />

                <div 
                    className="relative w-full max-w-md rounded-lg bg-white px-6 py-4 shadow-xl mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Détails de la commande</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Ajoutez le numéro de table et des notes spéciales pour cette commande.
                        </p>
                    </div>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="table-number">Numéro de table</Label>
                            <div className={`overflow-y-auto max-h-60 border rounded-lg p-2 ${styles.ScrolltableItem}`}>
                                <div className={`grid grid-cols-4 gap-2`}>
                                    {tables.length > 0 ? (
                                        tables.map((table, index) => (
                                            <div
                                                key={index}
                                                className={`flex flex-col items-center justify-center p-2 border rounded-lg cursor-pointer  ${
                                                    tableNumber === table.id
                                                        ? "bg-[#2d3748] border-[#2d3748] text-white"
                                                        : "hover:bg-gray-100"
                                                }`}
                                                onClick={() => setTableNumber(table.id)}
                                            >
                                                <img src={image} alt="table" className="w-10 h-10" />
                                                <span className="text-sm mt-1 text-center">{table.tableName}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-4 text-center text-gray-500">
                                            Aucune table disponible
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Special Note Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="order-note">Note spéciale</Label>
                            <Input
                                id="order-note"
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                placeholder="Ex: Sans gluten, allergies, etc."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Fermer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )}


    </>
  );
});

export default Cart;