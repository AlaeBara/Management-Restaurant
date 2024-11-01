import React, { useState } from 'react';
import style from "./UserCarts.module.css";
import { Edit, Trash2, Settings } from 'lucide-react';
import UserStatus from './UserStatus';

const userCarts = ({ user, updateStatus, deleteUser, UpdateGetData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const formatDate = (lastLogin) => {
        if (!lastLogin) return "introuvable";
        const date = new Date(lastLogin);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setIsModalVisible(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            deleteUser(userToDelete);
            setIsModalVisible(false);
        }
    };

    const cancelDelete = () => {
        setIsModalVisible(false);
        setUserToDelete(null);
    };

    return (
        <>
            <div className={style.userCard} key={user.id}>

                <div className={`${style.status} ${style[user.status]}`}>
                    {user.status === UserStatus.ACTIVE ? "Actif" :
                        user.status === UserStatus.INACTIVE ? "Inactif" :
                        user.status === UserStatus.SUSPENDED ? "Suspendu" :
                        user.status === UserStatus.BANNED ? "Banni" :
                        user.status === UserStatus.ARCHIVED ? "Archivé" :
                        user.status === "email-unverified" ? "Non vérifié" :
                        user.status === "deleted" ? "Supprimé" : ""}
                </div>
                
                <div className={style.headerCart}>
                    <img
                        src="https://e7.pngegg.com/pngimages/931/209/png-clipart-computer-icons-symbol-avatar-logo-person-with-helmut-miscellaneous-black.png"
                        alt="Avatar"
                        className={style.avatar}
                    />
                    <div className={style.userInfo}>
                        <h3>{user.firstname} {user.lastname}</h3>
                        <p className={style.username}>@{user.username}</p>
                    </div>
                </div>

                <p className={style.email}>{user.email}</p>
                <p className={style.lastLogin}>Dernier Login: {formatDate(user.lastLogin)}</p>
                <p className={style.lastLogin}>Créer à: {formatDate(user.createdAt)}</p>

                <div className={style.userAction}>
                    <div className={style.btn} onClick={() => UpdateGetData(user)}>
                        <Edit className="mr-2 h-4 w-4" /> Mise à Jour
                    </div>

                    {user.status !== "deleted" && (
                        <div className={style.btn} onClick={() => updateStatus(user.status, user.id)}>
                            <Settings className="mr-2 h-4 w-4" /> Changer le Statut
                        </div>
                    )}

                    {user.status !== "deleted" && (
                        <div
                            className={`${style.btn} ${style.delete}`}
                            onClick={() => handleDeleteClick(user.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for delete confirmation */}
            {isModalVisible && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <h3>Confirmation</h3>
                        <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                        <div className={style.modalActions}>
                            <button className={style.cancelBtn} onClick={cancelDelete}>Non</button>
                            <button className={style.confirmBtn} onClick={confirmDelete}>Oui</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default userCarts;
