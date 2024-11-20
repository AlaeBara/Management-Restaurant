import React, { useState } from 'react';
import style from "./ZoneCart.module.css";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, LandPlot } from 'lucide-react';

const ZoneCart = ({ zone , Delete }) => {
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
        Delete(id)
    };
    
    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/dash/Update-Zone/${id}`);
    };
    
    return (
        <>
            <div className={style.zoneCart} onClick={() => navigate(`/dash/Zone/${zone.id}`)}  >

                <div className={style.header}>

                    <div className={style.zoneInfo}>
                        <h3 className={style.zoneTitle}> <LandPlot className="mr-2 " /> {zone.zoneLabel} </h3>
                        <p className={style.zoneLabel}>Zone Code: {zone.zoneCode}</p>
                        <div className={style.dateInfo}>
                            <span>Créé le: {formatDate(zone.createdAt)}</span>
                        </div>
                    </div>

                </div>

                <div className={`${style.actions}`}>
                    <button
                        onClick={(e) => handleEdit(zone.id, e)}
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
                            Êtes-vous sûr de vouloir supprimer le Zone "{zone?.zoneLabel}" ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={()=>confirmDelete(zone.id)}
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

export default ZoneCart;