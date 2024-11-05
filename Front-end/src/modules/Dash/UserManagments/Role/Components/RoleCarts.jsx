import React, { useState } from 'react';
import style from "./RolesCarts.module.css";

const RoleCart = ({ role  }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return "introuvable";
        const date = new Date(dateString);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };

    const handleDelete = () => {
        setUserToDelete(role);
        setIsModalVisible(true);
    };

    const confirmDelete = () => {
        setIsModalVisible(false);
        setUserToDelete(null);
    };

    const handleEdit = ()=>{
        console.log("aaaa")
    }

    return (
        <>
            <div className={style.roleCard}>

                <div className={style.header}>

                    <div className={style.roleInfo}>
                        <h3 className={style.roleTitle}>{role.name}</h3>
                        <p className={style.roleLabel}>{role.label}</p>
                        <div className={style.dateInfo}>
                            <span>Créé le: {formatDate(role.createdAt)}</span>
                        </div>
                    </div>

                </div>

                <div className={style.actions}>
                    <button
                        onClick={handleEdit}
                        className={`${style.actionButton} ${style.editButton}`}
                    >
                        Modifier
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`${style.actionButton} ${style.deleteButton}`}
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir supprimer le rôle "{userToDelete?.name}" ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
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

export default RoleCart;