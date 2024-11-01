import React from 'react';
import { X } from 'lucide-react';
import style from './UpdateUserStatusForm.module.css'; 
import UserStatus from './UserStatus'; 

const UpdateUserStatusForm = ({ status, oldstatus, handleStatus, updateStatusOfUsers, closeFormOfupdateStatus, statusError }) => {

    return (
        <div className={style.modalOverlay}>
            <form className={style.form} onSubmit={updateStatusOfUsers}>
                <div className={style.headerForm}>
                    <h1>Changer le status</h1>
                    <button onClick={closeFormOfupdateStatus} className={style.closeFormButton}>
                        <X />
                    </button>
                </div>
                {/* Form fields */}
                <div className={style.inputGroup}>
                    <label>Changer le statut de l'utilisateur:</label>
                    <select name="status" value={status} onChange={handleStatus}>
                        <option value="" disabled>
                            Sélectionner le statut
                        </option>
                        {Object.values(UserStatus)
                            .filter((statusValue) => statusValue !== oldstatus)
                            .map((statusValue) => (
                                <option key={statusValue} value={statusValue}>
                                    {statusValue.charAt(0).toUpperCase() + statusValue.slice(1).replace(/-/g, ' ')}
                                </option>
                            ))}
                    </select>
                    {statusError && <p className={style.error}>{statusError}</p>}
                </div>

                <button type="submit" className={style.submitButton}>
                    Modifier
                </button>
            </form>
        </div>
    );
};

export default UpdateUserStatusForm;
