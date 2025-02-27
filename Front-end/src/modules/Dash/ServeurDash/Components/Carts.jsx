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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter , DialogClose } from '@/components/ui/dialog';




const Cart = React.memo(({ showCart }) => {

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
            tableId: "00955e03-7c92-42ef-94ef-596bb1e68dde", 
            items: cart.map(item => ({
            productId: item.productId,
            type: item.type,
            // supplements: item.supplements,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          }))
        };
        console.log(transformedCart)
        return transformedCart;
    };
    const handleSendOrder = async () => {
        const orderData = transformCartData();
        const response = await sendOrder(orderData);
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
        }
        else {
            toast.error(response?.data?.message || error , {
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
                <button className={`${styles.paymentButton} ${loading ? 'opacity-50' : ''}`} onClick={handleSendOrder} disabled={loading}>
                    {loading ? <Loader className="h-6 w-6 animate-spin" /> : 'Enregistrer la commande'}
                </button>

                <button className={styles.CleanButton} onClick={clearCart}>
                    <Trash2 />
                </button>
            </div>
        </div>


        {/* Table and Note Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
            <DialogContent className="sm:w-full w-80 rounded-lg">
                <DialogHeader>
                    <DialogTitle>Détails de la commande</DialogTitle>
                    <DialogDescription>
                    Ajoutez le numéro de table et des notes spéciales pour cette commande.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="table-number">Numéro de table</Label>
                        <Input
                            id="table-number"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="Ex: 12"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="order-note">Note spéciale</Label>
                        <Input
                            id="order-note"
                            value={orderNote}
                            onChange={(e) => setOrderNote(e.target.value)}
                            placeholder="Ex: Sans gluten, allergies, etc."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button">Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </>
  );
});

export default Cart;