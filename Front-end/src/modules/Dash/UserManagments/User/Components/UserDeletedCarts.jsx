import React, { useState } from 'react';
import style from "./UserDeletedCarts.module.css";
import {RotateCcw} from 'lucide-react';

const userCarts = ({ user, restore }) => {
    const formatDate = (lastLogin) => {
        if (!lastLogin) return "introuvable";
        const date = new Date(lastLogin);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
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
                    <div className={style.btn} onClick={() =>restore(user.id)}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Réactiver l’utilisateur
                    </div>

                    
                </div>
            </div>

        </>
    );
};

export default userCarts;
