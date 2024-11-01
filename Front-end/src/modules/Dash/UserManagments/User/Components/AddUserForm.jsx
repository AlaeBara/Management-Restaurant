import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import style from './AddUserForm.module.css'; // Adjust the path as needed

const AddUserForm = ({ formData, handleChange, handleSubmit, setShowPassword, showPassword, errors, CloseForm }) => {
    return (
        <div className={style.modalOverlay}>
            <form className={style.form} onSubmit={handleSubmit}>
                <div className={style.headerForm}>
                    <h1>Créer nouveau utilisateur</h1>
                    <button onClick={CloseForm} className={style.closeFormButton}>
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
                    Ajouter
                </button>
            </form>
        </div>
    );
};

export default AddUserForm;
