import React, { useEffect, useState } from 'react'
import styles from './RoleDetails.module.css'
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import { useParams } from 'react-router-dom';   
import Cookies from 'js-cookie';
import { formatDate } from '../../../../components/dateUtils/dateUtils';
import Spinner from '../../../../components/Spinner/Spinner';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ErrorMessage = ({ message }) => (
    <Alert variant="destructive" className="mt-4 mb-4 text-center">
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);

const RoleDetails = () => {
    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);

    // Combined loading state for initial data fetch
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    
    // Error states
    const [errors, setErrors] = useState({
        role: null,
        permissions: null,
        update: null
    });

    // fetch role data  
    const fetchRole = async () => {
        setErrors(prev => ({ ...prev, role: null }));
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRole(response.data);
        } catch (error) {
            console.error("Error fetching role:", error);
            setErrors(prev => ({
                ...prev,
                role: "Impossible de charger les informations du rôle. Veuillez réessayer plus tard."
            }));
        }
    };

    //fetch all permissions
    const fetchPermissions = async () => {
        setErrors(prev => ({ ...prev, permissions: null }));
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}/permissions/group-by-resource`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPermissions(response.data);
        } catch (error) {
            console.error("Error fetching permissions:", error);
            setErrors(prev => ({
                ...prev,
                permissions: "Impossible de charger les permissions. Veuillez réessayer plus tard."
            }));
        }
    }

    //api for give permission to role
    const GivePermissionToRole = async (permissionId) => {
        setErrors(prev => ({ ...prev, update: null }));
        try {
            const token = Cookies.get('access_token');
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}/permissions/${permissionId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await Promise.all([fetchRole(), fetchPermissions()]);
        } catch (error) {
            console.error("Error give permission to role:", error);
            const errorMessage = error.response?.data?.message || "Erreur lors de l'ajout de la permission";
            toast.error(errorMessage);
            setErrors(prev => ({ ...prev, update: errorMessage }));
        }
    }

    //api for remove permission to role
    const RemovePermissionToRole = async (permissionId) => {
        setErrors(prev => ({ ...prev, update: null }));
        try {
            const token = Cookies.get('access_token');
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}/permissions/${permissionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await Promise.all([fetchRole(), fetchPermissions()]);
        } catch (error) {
            console.error("Error remove permission to role:", error);
            const errorMessage = error.response?.data?.message || "Erreur lors de la révocation de la permission";
            toast.error(errorMessage);
            setErrors(prev => ({ ...prev, update: errorMessage }));
        }
    }

    // Toggle permission for a role
    const togglePermission = (permission) => {
        if (permission.currentUserHasPermission) {
            RemovePermissionToRole(permission.id);
        } else {
            GivePermissionToRole(permission.id);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsInitialLoading(true);
            await Promise.all([fetchRole(), fetchPermissions()]);
            setIsInitialLoading(false);
        };

        loadInitialData();
    }, [id]);

    if (isInitialLoading) {
        return (
            <div className={styles.container}>
               
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Gestion des Rôles & Permissions</h1>
                    <p>Configurez et gérez les rôles des utilisateurs et leurs permissions associées dans le système</p>
                </div>

                {isInitialLoading  
                    ?  
                        <div className="mt-5">
                            <Spinner title="Chargement des données..." />
                        </div>  
                    : 
                <>
                    <div className={styles.RoleDetails}>
                        <h1>Rôle Information :</h1>

                        <div className={styles.roleCard}>
                            {errors.role && <ErrorMessage message={errors.role} />}
                            {role && (
                                <div className={styles.roleInfo}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.label}>Nom du rôle :</span>
                                        <h2>{role.name}</h2>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.label}>Description :</span>
                                        <p>{role.label}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.label}>Date de création :</span>
                                        <p>{formatDate(role.createdAt)}</p>
                                    </div>
                                </div>   
                            )}
                        </div>
                    </div>

                    <div className={styles.Permissions}>
                        <h2 className={styles.permissionsTitle}>Permissions :</h2>
                        {errors.permissions && <ErrorMessage message={errors.permissions} />}
                        {errors.update && <ErrorMessage message={errors.update} />}
                        {Object.keys(permissions).length > 0 && (
                            <div className={styles.permissionsContainer}>
                                {Object.entries(permissions).map(([resource, permissionList]) => (
                                    <div key={resource} className={styles.permissionGroup}>
                                        <h3 className={styles.resourceName}>{resource}</h3>
                                        <ul className={styles.permissionList}>
                                            {permissionList.map((permission) => (
                                                <li key={permission.id} className={styles.permissionItem}>
                                                    <div className={styles.permissionHeader}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={permission.currentUserHasPermission}
                                                            onChange={() => togglePermission(permission)}
                                                        />
                                                        <span className={styles.permissionName}>{permission.name}</span>
                                                    </div>
                                                    <p className={styles.permissionLabel}>{permission.label}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </>    
                    
            }
            </div>
        </>
    )
}

export default RoleDetails