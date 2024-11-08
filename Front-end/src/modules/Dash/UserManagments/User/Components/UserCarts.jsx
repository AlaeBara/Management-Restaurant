import React, { useState } from 'react';
import style from "./UserCarts.module.css";
import { Edit, Trash2, Settings } from 'lucide-react';
import UserStatus from './UserStatus';
import { useNavigate } from 'react-router-dom';

const userCarts = ({ user, deleteUser}) => {

    const navigate = useNavigate()
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

                        {user.roles[0]?.name  ? 
                            <p className={style.username}>
                                @{user.roles[0]?.name}
                            </p>: 
                            <p className={style.sansrole}>
                                sans rôle
                            </p>
                        }
                    </div>
                </div>

                <p className={style.email}>{user.email}</p>
                <p className={style.lastLogin}>Dernier Login: {formatDate(user.lastLogin)}</p>
                <p className={style.lastLogin}>Créer à: {formatDate(user.createdAt)}</p>

                <div className={style.userAction}>
                    <div className={style.btn} onClick={() => navigate(`/dash/Update-user/${user.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Mise à Jour
                    </div>

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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all ease-in-out duration-300">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h3>
                            <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                            <div className="flex justify-end space-x-4">
                            <button 
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                                onClick={cancelDelete}
                            >
                                Annuler
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                onClick={confirmDelete}
                            >
                                Supprimer
                            </button>
                            </div>
                        </div>
                    </div>
              </div>
            )}


        </>
    );
};

export default userCarts;
