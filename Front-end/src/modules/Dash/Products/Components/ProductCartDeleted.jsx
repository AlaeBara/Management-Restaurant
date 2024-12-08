import React, { useState } from 'react';
import style from "./ProductCartDeleted.module.css";
import { useNavigate } from 'react-router-dom';
import { RotateCcw , Trash2, ShoppingBag  } from 'lucide-react';

const ProductCartDeleted = ({ product  , Restore}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate()
    const formatDate = (dateString) => {
        if (!dateString) return "introuvable";
        const date = new Date(dateString);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };
    const handleDelete = (e) => {
        e.stopPropagation();
        setIsModalVisible(true);
    };
    const confirmDelete = (id) => {
        setIsModalVisible(false)
        Restore(id)
    };
    

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };
    
    return (
        <>
            <div className={style.zoneCart}>

                <div className={style.header}>

                    <div className={style.zoneInfo}>
                        <h3 className={style.zoneTitle}> <ShoppingBag  className="mr-2 " /> {product.productName} </h3>
                        <p className={style.zoneLabel}><span className={style.blacktext}>Type de Produit : </span>{product.productType}</p>
                        <p className={style.zoneLabel}><span className={style.blacktext}>SKU du produit :</span> {product.productSKU}</p>
                        <p className={style.zoneLabel}><span className={style.blacktext}>Produit offert :</span> {product.isOffered ? 'Actif' : 'Inactif'}</p>  
                        <p className={style.zoneLabel}><span className={style.blacktext}>Description : </span> 
                            {product.productDescription ? (
                                <>
                                    {isExpanded || product.productDescription.length <= 20
                                        ? product.productDescription
                                        : `${product.productDescription.substring(0, 20 )}...`}
                                    {product.productDescription.length > 20  && (
                                        <button onClick={toggleExpand} className={style.toggleButton}>
                                            {isExpanded ? 'Voir moins' : 'Voir plus'}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <span className={style.vide}> - </span>
                            )}
                        </p> 
                        <div className={style.zoneLabel}>
                            <span><span className={style.blacktext}>Créé le :</span> {formatDate(product.createdAt)}</span>
                        </div>
                    </div>

                </div>

                <div className={`${style.actions}`}>
                    <button
                        onClick={(e) => handleDelete(e)}
                        className={`${style.actionButton} ${style.editButton}`}
                    >
                        <RotateCcw  className="mr-2 h-4 w-4" /> Restaurer
                    </button>
                </div>
            </div>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmer la restauration</h3>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir restaurer le produit "{product?.productName}" ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={()=>confirmDelete(product.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Restaurer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCartDeleted ;