import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import style from './CreateUser.module.css';
import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleX , X } from 'lucide-react';


// Define the Zod schema for validation
const schema = z.object({
  firstname: z.string().min(5, { message: 'Le prénom est requis' }),
  lastname: z.string().min(5, { message: 'Le nom est requis' }),
  username: z.string().min(5, { message: "Le nom d'utilisateur est requis" }),
  password: z.string().min(5, { message: 'Le mot de passe doit contenir au moins 5 caractères' }),
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
  gender: z.string().nonempty({ message: 'Le genre est requis' }),
});

const CreateUsers = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        gender: '',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        schema.parse(formData);
        const token = Cookies.get('access_token');

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setFormData({
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            email: '',
            gender: '',
        });
        setErrors({});
        toast.success('Utilisateur créé avec succès!', {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
        });
        } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = {};
            error.errors.forEach(({ path, message }) => {
            fieldErrors[path[0]] = message;
            });
            setErrors(fieldErrors);
        } else {
            console.error('Error creating user:', error);
            let errorMessage = 'Erreur lors de la création de l\'utilisateur';

            if (error.response?.data?.message) {
            if (error.response.data.message.includes('User already exists')) {
                errorMessage = "L'utilisateur existe déjà";
            } else if (error.response.data.message.includes('Invalid token')) {
                errorMessage = "Token invalide";
            } else {
                errorMessage = error.response.data.message;
            }
            }

            toast.error(errorMessage, {
            icon: '❌',
            position: "top-right",
            autoClose: 3000,
            });
        }
        }
    };

    const CloseForm = () => {
        setIsFormVisible(false)
        setFormData({
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            email: '',
            gender: '',
        });
        setErrors({});

    }




    
    const users = [
            {
                id: 1,
                firstname: "Ayoub",
                lastname: "Baraoui",
                username: "superadmin",
                email: "superadmin@admin.com",
                lastLogin: "2024-10-30",
                status: "active",
            },
            {
                id: 2,
                firstname: "Sarah",
                lastname: "Lamine",
                username: "sarah123",
                email: "sarah@domain.com",
                lastLogin: "2024-10-28",
                status: "blocked",
            },
            {
                id: 3,
                firstname: "Omar",
                lastname: "Reda",
                username: "omar_r",
                email: "omar@domain.com",
                lastLogin: "2024-10-29",
                status: "active",
            },
            {
                id: 4,
                firstname: "Omar",
                lastname: "Reda",
                username: "omar_r",
                email: "omar@domain.com",
                lastLogin: "2024-10-29",
                status: "active",
            },
            {
                id: 5,
                firstname: "Omar",
                lastname: "Reda",
                username: "omar_r",
                email: "omar@domain.com",
                lastLogin: "2024-10-29",
                status: "active",
            },
            {
                id: 6,
                firstname: "Omar",
                lastname: "Reda",
                username: "omar_r",
                email: "omar@domain.com",
                lastLogin: "2024-10-29",
                status: "active",
            }
    ];

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

    const handleAction = (action, user) => {
        switch (action) {
            case 'details':
                console.log('View details for user:', user);
                break;
            case 'update':
                console.log('Update user:', user);
                break;
            case 'delete':
                console.log('Delete user:', user);
                break;
            default:
                break;
        }
        setActiveMenu(null);
    };


    

  return (
    <div className={style.container}>
        <ToastContainer />

        {/* header of page  */}
        <div className={style.Headerpage}>
            <h1 className={style.title}>gestion des utilisateurs</h1>
    
            <button onClick={() => setIsFormVisible(true)} className={style.showFormButton}>
                Ajouter un utilisateur
            </button> 
        </div>



        {/* Carts Of users */}
        {/* Carts Of users */}
        <div className={style.userGrid}>
            {users.map((user) => (
                <div className={style.userCard} key={user.id}>
                    <img
                        src="https://assets-us-01.kc-usercontent.com/5cb25086-82d2-4c89-94f0-8450813a0fd3/0c3fcefb-bc28-4af6-985e-0c3b499ae832/Elon_Musk_Royal_Society.jpg?fm=jpg&auto=format"
                        alt="Avatar"
                        className={style.avatar}
                    />
                    <div className={style.userInfo}>
                        <h3>{user.firstname} {user.lastname}</h3>
                        <p className={style.username}>@{user.username}</p>
                        <p className={style.email}>{user.email}</p>
                        <p className={style.lastLogin}>Last login: {user.lastLogin}</p>
                        <span className={`${style.status} ${style[user.status]}`}>
                            {user.status === "active" ? "Active" : "Blocked"}
                        </span>
                    </div>
                    <button 
                        className={style.menuButton} 
                        onClick={(e) => handleMenuClick(user.id, e)}
                        aria-label="More options"
                    >
                        <div className={style.menuDots}>
                            <div className={style.menuDot}></div>
                            <div className={style.menuDot}></div>
                            <div className={style.menuDot}></div>
                        </div>
                    </button>
                    <div className={`${style.dropdownMenu} ${activeMenu === user.id ? style.show : ''}`}>
                        <div 
                            className={style.dropdownItem}
                            onClick={() => handleAction('details', user)}
                        >
                            Details
                        </div>
                        <div 
                            className={style.dropdownItem}
                            onClick={() => handleAction('update', user)}
                        >
                            Update
                        </div>
                        <div 
                            className={`${style.dropdownItem} ${style.delete}`}
                            onClick={() => handleAction('delete', user)}
                        >
                            Delete
                        </div>
                    </div>
                </div>
            ))}
        </div>



        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        {/* forum for add user */}
        {isFormVisible && (
            <div className={style.modalOverlay}>
                <form className={style.form} onSubmit={handleSubmit}>
                    <div className={style.headerForm}>
                        <h1>Cree nouveau utilisatuer</h1>
                        <button onClick={() => CloseForm()} className={style.closeFormButton}>
                            <X />
                        </button>
                    </div>
                    {/* Form fields */}
                    <div className={style.nameContainer}>
                        <div className={style.inputGroup}>
                            <label>Prénom</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                placeholder="Prénom"
                            />
                            {errors.firstname && <p className={style.error}>{errors.firstname}</p>}
                        </div>
                            <div className={style.inputGroup}>
                            <label>Nom</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Nom"
                            />
                            {errors.lastname && <p className={style.error}>{errors.lastname}</p>}
                        </div>
                    </div>

                    <div className={style.inputGroup}>
                        <label>Nom d'utilisateur</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nom d'utilisateur"
                        />
                        {errors.username && <p className={style.error}>{errors.username}</p>}
                    </div>

                    <div className={style.inputGroup} style={{ position: 'relative' }}>
                        <label>Mot de passe</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mot de passe"
                        />
                        <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{ position: 'absolute', right: 10, top: 43, cursor: 'pointer' }}
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                        {errors.password && <p className={style.error}>{errors.password}</p>}
                    </div>

                    <div className={style.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        {errors.email && <p className={style.error}>{errors.email}</p>}
                    </div>

                    <div className={style.inputGroup}>
                        <label>Genre</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Sélectionnez le genre</option>
                            <option value="male">Masculin</option>
                            <option value="female">Féminin</option>
                        </select>
                        {errors.gender && <p className={style.error}>{errors.gender}</p>}
                    </div>

                    <button type="submit" className={style.submitButton}>
                        Soumettre
                    </button>
                </form>
            </div>
        )}
    </div>
  );
};

export default CreateUsers;
