import React, { useEffect, useState , useCallback } from 'react';
import axios from 'axios';
import style from './AllUser.module.css';
import Cookies from 'js-cookie';
import {SearchX  ,UserRoundCog, Plus , ExternalLink , Ban } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../../../../context/UserContext';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import PaginationNav from './Components/PaginationNav' 

//validation Shema
import { UpdateSchema } from './schemas/UpdateSchema';
//components
import Spinner from '../../../../components//Spinner/Spinner'
import UpdateUserForm from './components/UpdateUserForm'; 
import UpdateUserStatusForm from './components/UpdateUserStatusForm';
import UserCarts from './Components/UserCarts'

 
const CreateUsers = () => {
    const { user } = useUserContext()

    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        gender: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorgetdate, setErrorgetdate] = useState(null);

    //for get all user
    const [dataUser, setDataUser] = useState([]);
    const [numberOfData, setnumberOfData] = useState([])
    ;
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10); // Items per page

    const totalPages = Math.ceil(numberOfData / limit);

    
    const fetchUsers = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        const token = Cookies.get('access_token');
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/users`, 
                {
                    params: { page, limit, sort: 'createdAt:desc' },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDataUser(response.data.data);
            setnumberOfData(response.data.total-1);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setErrorgetdate("Une erreur s'est produite lors du chargement des utilisateurs.");
        } finally {
            setLoading(false); 
        }
    }, []);

    // Fetch data on initial render and whenever currentPage or limit changes
    useEffect(() => {
        fetchUsers(currentPage, limit);
    }, [currentPage, limit, fetchUsers]);

    // Navigate to the next page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    // Navigate to the previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // Calculate item range
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, numberOfData);




    
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
            <h1 className={style.title}>Gestion Des Utilisateurs</h1>
        </div>

        <div className={style.Headerpage}>

            <button onClick={() => navigate('/dash/Deleted-User')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Les Utilisateurs Supprimés
            </button> 
        
            <button onClick={() => navigate('/dash/Add-User')} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter un utilisateur
            </button> 
        </div>


        {/* Carts Of users */}
        <div>
            {loading ? (
                <div className={style.spinner}>
                <Spinner title="Chargement des utilisateurs..." />
                </div>
            ) : (
                <>
                    {errorgetdate ? (
                        <div className={style.notfound}>
                            <Ban className={style.icon} />
                            <h1>{errorgetdate}</h1>
                        </div>

                    ) : (
                        <>
                        {dataUser.length - 1 > 0 ? (
                            <>
                                <div className={style.total}>
                                    <UserRoundCog className="mr-2" />
                                    Total des utilisateurs : {numberOfData - 1}
                                </div>
                            
                                <div className={style.userGrid}>
                                    {dataUser
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
                                    ))}
                                </div>

                                {/* Navigation */}
                                <PaginationNav
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    startItem={startItem}
                                    endItem={endItem}
                                    numberOfData={numberOfData}
                                    onPreviousPage={handlePreviousPage}
                                    onNextPage={handleNextPage}
                                />
                            </>
                    ) : (
                        // No Users Found Message
                        <div className={style.notfound}>
                            <SearchX className={style.icon} />
                            <h1>Aucun utilisateur trouvé</h1>
                        </div>
                    )}
                </>
            )}
            </>
        )}
        </div>


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
