import React, { useState } from 'react';
import style from "./CartInventory.module.css";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, ClipboardList ,Sliders} from 'lucide-react';

const InventoryCart = ({ inventory ,Delete }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate()
    const formatDate = (dateString) => {
        if (!dateString) return "introuvable";
        const date = new Date(dateString);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    }
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
        navigate(`/dash/inventaires/mettre-à-jour-inventaire/${id}`);
    };
    const handleAddAdjustement = (id, e) => {
        e.stopPropagation();
        navigate(`/dash/inventaires/ajouter-adjustement/${id}`);
    };

    return (
        <>
            <div className={style.zoneCart} onClick={()=> navigate(`/dash/inventaires/detail/${inventory.id}`)}>

                <div className={style.header}>

                    <div className={style.zoneInfo}>
                        <h3 className={style.zoneTitle}> <ClipboardList className="mr-2 " /> {inventory.sku}  </h3>
                        <p className={style.zoneLabel}>
                            <span className={style.blacktext}>Produit :</span> {inventory.productName || '-'}
                        </p>
                        <p className={style.zoneLabel}> <span className={style.blacktext}>Quantité totale :</span> {inventory.totalQuantity || 0} {inventory.productUnit} </p>
                        <p className={style.zoneLabel}>
                            <span className={style.blacktext}>Quantité d'alerte :</span> {inventory.warningQuantity || 'Non spécifié'} {inventory.productUnit}
                        </p>
                        <p className={style.zoneLabel}>
                            <span className={style.blacktext}>Placement de Stock :</span> {inventory.storageName || '-'}
                        </p>
                        <div className={style.zoneLabel}>
                            <span> <span className={style.blacktext}>Créé le :</span> {formatDate(inventory.createdAt)}</span>
                        </div>
                    </div>

                </div>

                <div className={`${style.actions}`}>
                    <button
                        onClick={(e) => handleEdit(inventory.id, e)}
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
                
                <button
                    onClick={(e) => handleAddAdjustement(inventory.id, e)}
                    className={`${style.actionButton2} ${style.btnAdjustement}`}
                >
                    <Sliders className="mr-2 h-4 w-4" /> Ajoute Adjustement
                </button>
            </div>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir supprimer l'inventaire "{inventory?.sku}" ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={()=>confirmDelete(inventory.id)}
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

export default InventoryCart ;