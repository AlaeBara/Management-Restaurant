import React, { useState } from 'react';
import style from "./CartFund.module.css";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Wallet } from 'lucide-react';

const CartFund = ({ fund,Delete }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate()
    
    const handleDelete = (e) => {
        e.stopPropagation();
        setIsModalVisible(true);
    };
    const confirmDelete = (id) => {
        setIsModalVisible(false)
        Delete(id)
    };
    
    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/dash/caisses/mettre-à-jour-caisse/${id}`);
    };


    return (
        <>
            <div className={style.zoneCart} onClick={()=>navigate(`/dash/caisses/detail/${fund.id}`)}>

                <div className={style.header}>

                    <div className={style.zoneInfo}>

                        <div className={style.walleticon}>
                            <Wallet className="h-5 w-5 text-muted-foreground" />
                        </div>

    
                        <p className={style.zoneLabel}>{fund.sku} </p>
                        <h3 className={style.zoneTitle}> {fund.balance} Dh </h3>
                        <p className={style.zoneLabel}>Cliquez pour voir les transactions</p>

                    </div>

                </div>

                <div className={`${style.actions}`}>
                    <button
                        onClick={(e) => handleEdit(fund.id, e)}
                        className={`${style.actionButton} ${style.editButton}`}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Modifier
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`${style.actionButton} ${style.deleteButton}`}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                    </button>
                </div>
            </div>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir supprimer la Caisse "{fund?.name}" ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={()=>confirmDelete(fund.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartFund ;