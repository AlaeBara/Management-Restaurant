import React, { useState } from 'react';
import style from "./CartCategorieDeleted.module.css";
import { useNavigate } from 'react-router-dom';
import { RotateCcw , Trash2, Component } from 'lucide-react';

const CategorieCartDeleted = ({ category ,Restore}) => {
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
                        <h3 className={style.zoneTitle}> <Component className="mr-2 " /> {category.categoryName}  </h3>
                        <p className={style.zoneLabel}>Code de catégorie : {category.categoryCode}</p>
                        <p className={style.zoneLabel}>Parent catégorie : {category.parentCategory?.categoryName || "-"}</p>
                        <p className={style.zoneLabel}>Temps actif : {category.isTimeRestricted ? `De ${category.activeTimeStart} à ${category.activeTimeEnd}` : "Non restreint"}</p>
                        <p className={style.zoneLabel}>
                            Jours actifs : 
                            {category.activeDays && category.activeDays.length > 0 ? (
                                <>
                                {isExpanded || category.activeDays.length <= 2
                                    ? category.activeDays.join(", ")
                                    : `${category.activeDays.slice(0, 2).join(", ")}...`}
                                {category.activeDays.length > 2 && (
                                    <button onClick={toggleExpand} className={style.toggleButton}>
                                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                                    </button>
                                )}
                                </>
                            ) : (
                                <span className={style.vide}> - </span>
                            )}      
                        </p>
  
                        <p className={style.zoneLabel}>Description : 
                            {category.categoryDescription ? (
                                <>
                                    {isExpanded || category.categoryDescription.length <= 30
                                        ? category.categoryDescription
                                        : `${category.categoryDescription.substring(0, 30 )}...`}
                                    {category.categoryDescription.length > 30  && (
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
                            <span>Créé le: {formatDate(category.createdAt)}</span>
                        </div>
                    </div>

                </div>

                <div className={`${style.actions}`}>
                    <button
                        onClick={(e) => handleDelete( e)}
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
                            Êtes-vous sûr de vouloir restaurer la Catégorie "{category?.categoryName}" ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={()=>confirmDelete(category.id)}
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

export default CategorieCartDeleted;