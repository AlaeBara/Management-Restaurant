import React, { useState } from 'react';
import style from "./UserDeletedCarts.module.css";
import {RotateCcw} from 'lucide-react';

const userCarts = ({ user, restore }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const formatDate = (lastLogin) => {
        if (!lastLogin) return "introuvable";
        const date = new Date(lastLogin);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };
    const handleRestore = (e) => {
        e.stopPropagation();
        setIsModalVisible(true);
    };
    const confirmRestore = (id) => {
        setIsModalVisible(false)
        restore(id)
    };

    return (
        <>
            <div className={style.userCard} key={user.id}>

                <div className={`${style.status} ${style[user.status]}`}>
                    {user.status === "deleted" ? "Supprimé" : ""}
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
                    <div className={style.btn} onClick={handleRestore}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Restaurer
                    </div>

                    
                </div>
            </div>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmer la restauration</h3>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir restaurer l'utilisateur "{user.firstname} {user.lastname}" ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={()=>confirmRestore(user.id)}
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

export default userCarts;
