import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './AllUser.module.css';
import Cookies from 'js-cookie';
import { SearchX , UserRoundCog,  EllipsisVertical , RotateCcw  } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  UserStatus  from './UserStatus';

 
const DeletedUsers = () => {
    
    //for get all user Supprimés
    const [dataUser, setDataUser] = useState([]);
    const fetchUsers = async () => {
        try{
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users?withDeleted=${true}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataUser(response.data.data);
        }
        catch(error){
            console.error(error.response.data.message)
        }
        
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    //for the menu (option of any user)
    const [activeMenu, setActiveMenu] = useState(null);
    const handleMenuClick = (userId, e) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === userId ? null : userId);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const Restore = async(id)=>{
        const token = Cookies.get('access_token');
        try{
            console.log(id)
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/restore`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchUsers();
            toast.success("Utilisateur restauré avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
        }
        catch(error){
            console.error(error.response.data.message)
            toast.error("Erreur lors de la restauration de l'utilisateur.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
       
    }


   
  return (
    <div className={style.container}>
        <ToastContainer />

        {/* header of page  */}
        <div className={style.Headerpage}>
            <h1 className={style.title}>Historique des Utilisateurs Supprimés</h1>
    
        </div>

        {dataUser.length > 0 && 
            <div className={style.total}> 
                <UserRoundCog className="mr-2"  /> Total des utilisateurs : {dataUser.length-1}  
            </div> 
        }

        {/* Carts Of users */}
        <div className={style.userGrid}>
            {dataUser.length > 0 &&
                (dataUser.map((user) => (
                    <div className={style.userCard} key={user.id}>

                        <div className={style.headerCart}>
                            <img
                                src="https://assets-us-01.kc-usercontent.com/5cb25086-82d2-4c89-94f0-8450813a0fd3/0c3fcefb-bc28-4af6-985e-0c3b499ae832/Elon_Musk_Royal_Society.jpg?fm=jpg&auto=format"
                                alt="Avatar"
                                className={style.avatar}
                            />
                            <div className={style.userInfo}>
                                <h3>{user.firstname} {user.lastname}</h3>
                                <p className={style.username}>@{user.username}</p>
                            </div>
                        </div>

                        <p className={style.email}>{user.email}</p><br />

                        <span className={`${style.status} ${style[user.status]}`}>
                            {user.status === UserStatus.ACTIVE ? "Actif" :
                            user.status === UserStatus.INACTIVE ? "Inactif" :
                            user.status === UserStatus.SUSPENDED ? "Suspendu" :
                            user.status === UserStatus.BANNED ? "Banni" :
                            user.status === UserStatus.ARCHIVED ? "Archivé" :
                            user.status === "email-unverified" ? "Non vérifié":
                            user.status === "deleted" ? "Supprimé": ""}
                        </span>


                        <button 
                            className={style.menuButton} 
                            onClick={(e) => handleMenuClick(user.id, e)}
                            aria-label="More options"
                        >
                            <EllipsisVertical />
                        </button>
                        <div className={`${style.dropdownMenu} ${activeMenu === user.id ? style.show : ''}`}>

                           
                            <div 
                                className={`${style.dropdownItem} ${style.delete}`}
                                onClick={() => Restore(user.id)}
                            >
                                <RotateCcw   className="mr-2 h-4 w-4" /> Réactiver l’utilisateur
                            </div>
                            
                        </div>
                    </div>
                )
            ))}
        </div>

        {dataUser.length ==0  &&
            <div className={style.notfound}>
                <SearchX className={style.icon} />
                <h1>Aucun utilisateur supprimé trouvé</h1>
            </div>
        }
    </div>
  );
};

export default DeletedUsers;
