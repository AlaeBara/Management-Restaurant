import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './AllUser.module.css';
import Cookies from 'js-cookie';
import {SearchX  ,UserRoundCog, Plus , ExternalLink  } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../../../../context/UserContext';
import { z } from 'zod';

//validation Shema
import { UserSchema } from './schemas/UserSchema';
import { UpdateSchema } from './schemas/UpdateSchema';
//components
import Spinner from '../../../../components//Spinner/Spinner'
import UpdateUserForm from './components/UpdateUserForm'; 
import UpdateUserStatusForm from './components/UpdateUserStatusForm';
import UserCarts from './Components/UserCarts'
import AddUserForm  from './Components/AddUserForm'

 
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
    const [loading, setLoading] = useState(false);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };


    //add user
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            UserSchema.parse(formData);
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
            fetchUsers();
            setIsFormVisible(false)
            setLoading(true);
            // Show spinner for 3 seconds and then hide
            setTimeout(() => {
                setLoading(false);
                toast.success('Utilisateur créé avec succès!', {
                    icon: '✅',
                    position: "top-right",
                    autoClose: 3000,
                });
            }, 3000);
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
    const [NumberOfData, setNumberOfData] = useState([]);

    const fetchUsers = async () => {
        const token = Cookies.get('access_token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users?sort=createdAt:desc`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setDataUser(response.data.data);
        setNumberOfData(response.data.total)
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
            UpdateSchema .parse(formUpdateData);
    
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
            <div>
                <h1 className={style.title}>gestion des utilisateurs</h1>
                <a href="/dash/Deleted-User" className={style.titleUserSupr} >
                    <ExternalLink className="mr-3 h-4 w-4 "/>Utilisateurs Supprimés
                </a>
            </div>
            
            <button onClick={() => setIsFormVisible(true)} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter un utilisateur
            </button> 
            
        </div>


        <div className={style.total}> 
            <UserRoundCog className="mr-2"  /> Total des utilisateurs : {NumberOfData-1}  
        </div> 
        

        {/* Carts Of users */}
        {loading ? (
                    <div className={style.spinner}>
                        <Spinner title="Création de l'utilisateur en cours..."/>
                    </div>
                    
                ) :
            (<div className={style.userGrid}>
                {dataUser.length > 0 &&
                    (dataUser
                    .filter(userData => userData.username !== user.username) 
                    .map(user => (
                        <UserCarts
                            key={user.id}
                            user={user}
                            formatDate={formatDate}
                            updateStatus={updateStatus}
                            deleteUser={deleteUser}
                            UpdateGetData={UpdateGetData}
                        />
                    )
                ))}
            </div>)
        }

        {dataUser.length ==0  &&
            <div className={style.notfound}>
                <SearchX className={style.icon} />
                <h1>Aucun utilisateur trouvé</h1>
            </div>
        }


        {/* forum for add user */}
        {isFormVisible && (
            <AddUserForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setShowPassword={setShowPassword}
                showPassword={showPassword}
                errors={errors}
                CloseForm={CloseForm}
            />
        )}

        {/* forum for update user */}
        {isEditing && (
            <UpdateUserForm
                formUpdateData={formUpdateData}
                handleChangeUpdate={handleChangeUpdate}
                updateSubmit={updateSubmit}
                errors={errors}
                CloseFormOfUpdate={CloseFormOfUpdate}
            />
        )}

        {/* for update status of user */}
        {isChangeStatus && (
            <UpdateUserStatusForm
                status={status}
                oldstatus={oldstatus}
                handleStatus={handleStatus}
                updateStatusOfUsers={updateStatusOfUsers}
                closeFormOfupdateStatus={closeFormOfupdateStatus}
                statusError={statusError}
            />
        )}

    </div>
  );
};

export default CreateUsers;
