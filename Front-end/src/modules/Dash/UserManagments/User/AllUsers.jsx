import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import style from './AllUser.module.css';
import Cookies from 'js-cookie';
import { Eye, EyeOff, SearchX ,X , UserRoundCog, Plus, EllipsisVertical , Info, Edit , Trash2 ,Settings, RotateCcw  } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  UserStatus  from './UserStatus';
import { useUserContext } from '../../../../context/UserContext';

 
// Define the Zod schema for validation -- create
const schema = z.object({
    firstname: z.string()
      .min(5, { message: 'Prénom trop court.' }),
  
    lastname: z.string()
      .min(5, { message: 'Nom trop court.' }),
  
    username: z.string()
      .min(5, { message: 'Nom d’utilisateur trop court.' }),
  
    password: z.string()
      .min(5, { message: 'Mot de passe trop court.' }),
  
    email: z.string()
      .email({ message: 'E-mail invalide.' }),
  
    gender: z.string()
      .nonempty({ message: 'Genre requis.' }),
  });
  
  

// Define the Zod schema for validation  -- update
const updateSchema = z.object({
    firstname: z.string()
        .min(5, { message: 'Prénom trop court' }),
  
    lastname: z.string()
        .min(5, { message: 'Nom trop court.' }),
  
    address: z.string()
        .min(5, { message: "L'adresse est trop courte." })
        .optional()
        .nullable()
        .or(z.literal("")),
    
    gender: z.string()
        .nonempty({ message: 'Genre requis.' }),
    
    // Add phone as an optional field that can be null
    phone: z.string()
        .nullable() // Allows phone to be null
        .optional() // Allows phone to be omitted
        .refine(value => value === null || /^[+]?[0-9\s]*$/.test(value), {
            message: 'Numéro de téléphone invalide.',
        }),
});



const CreateUsers = () => {
    const { user } = useUserContext()
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

    //add user
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
        fetchUsers();
        setIsFormVisible(false)
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

    //open and close form 
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

    //for get all user
    const [dataUser, setDataUser] = useState([]);
    const fetchUsers = async () => {
        const token = Cookies.get('access_token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setDataUser(response.data.data);
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


    //for the update 
    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [formUpdateData, setUpdateData] = useState({
        id: null,
        firstname: '',
        lastname: '',
        address: null,
        phone: null,
        gender: '',
    });

    const UpdateGetData = (user) => {
        setOriginalData(user);
        setUpdateData({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            address: user.address,
            phone:  user.phone,
            gender: user.gender,
        });
        setIsEditing(true);
    };


    const handleChangeUpdate = ({ target: { name, value } }) => {
        setUpdateData((prevData) => ({ ...prevData, [name]: value }));
    };

    const CloseFormOfUpdate = () => {
        setIsEditing(false)
        setUpdateData({
            id: null,
            firstname: '',
            lastname: '',
           address: null,
            phone: null,
            gender: '',
        });
        setErrors({});
    }
   
    const updateSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate the form data against the schema
            updateSchema.parse(formUpdateData);
    
            // Create an object to hold the data that will be updated
            const updatedData = {};
    
            // Loop through the keys of formUpdateData
            for (const key in formUpdateData) {
                // Only add fields that are changed or are not null
                if (formUpdateData[key] !== originalData[key]) {
                    // Set field to null if it's empty
                    updatedData[key] = formUpdateData[key] ? formUpdateData[key] : null; // Null if empty
                }
            }
    
            // Optional: Handle case where no fields have changed
            if (Object.keys(updatedData).length === 0) {
                toast.info('Aucune mise à jour nécessaire.', {
                    icon: 'ℹ️',
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }
    
            const token = Cookies.get('access_token');

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${originalData.id}`, 
                updatedData, // Send only updated values
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            // Reset form state after a successful update
            setUpdateData({
                id: null,
                firstname: '',
                lastname: '',
                address: null,
                phone: null, 
                email: '',
                gender: '',
            });
            setErrors({});
            toast.success('Utilisateur mis à jour avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchUsers();
            setIsEditing(false)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                error.errors.forEach(({ path, message }) => {
                    fieldErrors[path[0]] = message;
                });
                setErrors(fieldErrors);
            } else {
                console.error('Error updating user:', error.response.data.message);
                toast.error("Échec de la mise à jour de l'utilisateur.", {
                    icon: '❌',
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        }
    };
    
    // for show good formation of last lkogin of user
    const formatDate = (lastLogin) => {
        if (!lastLogin) return "introuvable";
        const date = new Date(lastLogin);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };



    //for update the status 
    const [status, setStatus] = useState("");
    const [oldstatus, setoldStatus] = useState("");
    const [isChangeStatus, setisChangeStatus] = useState(false);
    const [statusError, setStatusError] = useState("");

    const updateStatus =(status,id)=>{
        formData.id = id
        setisChangeStatus(true)
        setoldStatus(status)
    }

    const handleStatus = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        setStatusError(""); 
    }; 

    const closeFormOfupdateStatus =()=>{
        setisChangeStatus(false)
    } 
    const updateStatusOfUsers = async (e) => {
        e.preventDefault();
        try {
            if (!status) {
                setStatusError("Veuillez sélectionner un statut.");
                return;
            }
            console.log(`in try catch new value ${status}`);
            console.log(`in try catch old value:  ${oldstatus}`);
            const token = Cookies.get('access_token');
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${formData.id}/status`, {status:status} , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Statut de l’utilisateur mis à jour avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchUsers();
            setisChangeStatus(false)
            setStatus("")
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l’utilisateur:', error.response?.data?.message || error.message);
            toast.error("Échec de la mise à jour du statut de l’utilisateur. Veuillez réessayer.", {
                icon: '❌',
                position: "top-right",
                autoClose: 3000,
            });
        }
    };
    
   // delete user
    const deleteUser = async (id) => {
        try {
            const token = Cookies.get('access_token');
            console.log(id)
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/status/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('L’utilisateur a été supprimé avec succès!', {
                icon: '✅',
                position: "top-right",
                autoClose: 3000,
            });
            fetchUsers();
        } catch (error) {
            let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
            if (error.response?.data?.message) {
                if (error.response.data.message.includes('User is already deleted')) {
                    errorMessage = "L’utilisateur est déjà supprimé";
                } else if (error.response.data.message.includes('Super admin cannot be deleted')) {
                    errorMessage = "Le super administrateur ne peut pas être supprimé";
                } else {
                    errorMessage = error.response.data.message; 
                }
            }
            console.error('Error delete user:', error.response.data.message);
            toast.error(errorMessage, {
                icon: '❌',
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
            <h1 className={style.title}>gestion des utilisateurs</h1>
    
            <button onClick={() => setIsFormVisible(true)} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter un utilisateur
            </button> 
        </div>

        {dataUser.length > 0 && 
            <div className={style.total}> 
                <UserRoundCog className="mr-2"  /> Total des utilisateurs : {dataUser.length-1}  
            </div> 
        }


        {/* Carts Of users */}
        <div className={style.userGrid}>
            {dataUser.length > 0 &&
                (dataUser
                .filter(userData => userData.username !== user.username) // Exclude logged-in user
                .map(user => (
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

                        <p className={style.email}>{user.email}</p>
                        <p className={style.lastLogin}>
                            Dernier Login: {formatDate(user.lastLogin)}
                        </p>
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
                                className={style.dropdownItem}
                                onClick={() => handleAction('details', user)}
                            >
                                <Info className="mr-2 h-4 w-4" /> Détails
                            </div>

                            <div 
                                className={style.dropdownItem}
                                onClick={() => UpdateGetData(user)}
                            >
                               <Edit className="mr-2 h-4 w-4" /> Mise à Jour
                            </div>

                            {user.status !== "deleted" && (
                                <div 
                                    className={`${style.dropdownItem}`}
                                    onClick={() => updateStatus(user.status ,user.id)}
                                >
                                    <Settings  className="mr-2 h-4 w-4" /> Ghange Status
                                </div>
                            )}

                            {user.status !== "deleted" && (
                                <div 
                                    className={`${style.dropdownItem} ${style.delete}`}
                                    onClick={() => deleteUser(user.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                </div>
                            )}
                            
                        </div>
                    </div>
                )
            ))}
        </div>

        {dataUser.length ==0  &&
            <div className={style.notfound}>
                <SearchX className={style.icon} />
                <h1>Aucun utilisateur trouvé</h1>
            </div>
        }

        {/* forum for add user */}
        {isFormVisible && (
            <div className={style.modalOverlay}>

                <form className={style.form} onSubmit={handleSubmit}>

                    <div className={style.headerForm}>

                        <h1>Créer nouveau utilisateur</h1>
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
                        Ajouter
                    </button>
                </form>
            </div>
        )}



        {/* forum for update user */}
        {isEditing && (
            <div className={style.modalOverlay}>

                <form className={style.form} onSubmit={updateSubmit}>

                    <div className={style.headerForm}>

                        <h1>Modifier utilisateur</h1>
                        <button onClick={() => CloseFormOfUpdate()} className={style.closeFormButton}>
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
                        <label>Adress</label>
                        <input
                            type="text"
                            name="address"
                            value={formUpdateData.address  || ''}
                            onChange={handleChangeUpdate}
                            placeholder="Adress"
                        />
                        {errors.address && <p className={style.error}>{errors.address}</p>}
                    </div>

                    <div className={style.inputGroup} style={{ position: 'relative' }}>
                        <label>Telephone</label>
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
                        <select name="gender" value={formUpdateData.gender} onChange={handleChange}>
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
        )}


        {/* for update status of user */}
        {isChangeStatus && (
            <div className={style.modalOverlay}>

                <form className={style.form}  onSubmit={updateStatusOfUsers}>

                    <div className={style.headerForm}>

                        <h1>Changer le status</h1>
                        <button onClick={() => closeFormOfupdateStatus()} className={style.closeFormButton}>
                            <X />
                        </button>

                    </div>
                    {/* Form fields */}
                    <div className={style.inputGroup}>
                        <label>Change User Status:</label>
                        <select name="gender"  value={status} onChange={handleStatus}>
                            <option value="" disabled>
                                Select status
                            </option>
                            {Object.values(UserStatus).filter((statusValue) => statusValue !== oldstatus)
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
        )}

    </div>
  );
};

export default CreateUsers;
