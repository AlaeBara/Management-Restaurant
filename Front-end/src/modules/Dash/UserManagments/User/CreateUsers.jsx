import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import style from './CreateUser.module.css';
import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

            // Handling specific backend error messages
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
  

  return (
    <div className={style.container}>
        <ToastContainer />
        <h1 className={style.title}>Créer un utilisateur</h1>
        <form className={style.form} onSubmit={handleSubmit}>
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
  );
};

export default CreateUsers;
