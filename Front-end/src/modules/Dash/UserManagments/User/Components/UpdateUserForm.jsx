import React from 'react';
import { X } from 'lucide-react';
import style from './UpdateUserForm.module.css'; // Adjust the path as needed

const UpdateUserForm = ({ formUpdateData, handleChangeUpdate, updateSubmit, errors, CloseFormOfUpdate }) => {
    return (
        <div className={style.modalOverlay}>
            <form className={style.form} onSubmit={updateSubmit}>
                <div className={style.headerForm}>
                    <h1>Modifier utilisateur</h1>
                    <button onClick={CloseFormOfUpdate} className={style.closeFormButton}>
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
                            value={formUpdateData.firstname}
                            onChange={handleChangeUpdate}
                            placeholder="Prénom"
                        />
                        {errors.firstname && <p className={style.error}>{errors.firstname}</p>}
                    </div>
                    <div className={style.inputGroup}>
                        <label>Nom</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formUpdateData.lastname}
                            onChange={handleChangeUpdate}
                            placeholder="Nom"
                        />
                        {errors.lastname && <p className={style.error}>{errors.lastname}</p>}
                    </div>
                </div>

                <div className={style.inputGroup}>
                    <label>Adresse</label>
                    <input
                        type="text"
                        name="address"
                        value={formUpdateData.address || ''}
                        onChange={handleChangeUpdate}
                        placeholder="Adresse"
                    />
                    {errors.address && <p className={style.error}>{errors.address}</p>}
                </div>

                <div className={style.inputGroup} style={{ position: 'relative' }}>
                    <label>Téléphone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formUpdateData.phone || ''}
                        onChange={handleChangeUpdate}
                        placeholder="Numéro de téléphone"
                    />
                    {errors.phone && <p className={style.error}>{errors.phone}</p>}
                </div>

                <div className={style.inputGroup}>
                    <label>Genre</label>
                    <select name="gender" value={formUpdateData.gender} onChange={handleChangeUpdate}>
                        <option value="">Sélectionnez le genre</option>
                        <option value="male">Masculin</option>
                        <option value="female">Féminin</option>
                    </select>
                    {errors.gender && <p className={style.error}>{errors.gender}</p>}
                </div>

                <button type="submit" className={style.submitButton}>
                    Mettre à jour
                </button>
            </form>
        </div>
    );
};

export default UpdateUserForm;
