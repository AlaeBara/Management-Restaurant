import React, { useEffect, useState } from 'react'
import styles from './RoleDetails.module.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';   
import Cookies from 'js-cookie';
import { formatDate } from '../../../../components/dateUtils/dateUtils';




const RoleDetails = () => {

    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);


    // fetch role data  
    const fetchRole = async () => {
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
        }
    };

    //fetch all permissions

    const fetchPermissions = async () => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}/permissions/group-by-resource` , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPermissions(response.data);
        } catch (error) {
            console.error("Error fetching role:", error);
        }
    }

    //api for give permission to role
    const GivePermissionToRole = async (permissionId) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}/permissions/${permissionId}` , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPermissions(response.data);
        } catch (error) {
            console.error("Error fetching role:", error);
        }
    }


    useEffect(() => {
        fetchRole();
        fetchPermissions();
    }, [id]);


  return (
    <>
        <div className={styles.container}>

            <div className={styles.header}>
                <h1>Gestion des Rôles & Permissions</h1>
                <p>Configurez et gérez les rôles des utilisateurs et leurs permissions associées dans le système</p>
            </div>

            <div className={styles.RoleDetails}>
                
                <h1>Rôle Information :</h1>

                {role ? 
                    <div className={styles.roleCard}>
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
                    </div>

                    : <p>Loading role...</p>
                }
            </div>



            <div className={styles.Permissions}>
                <h2 className={styles.permissionsTitle}>Permissions :</h2>
                {Object.keys(permissions).length > 0 ? (
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
                ) : (
                    <p>Loading permissions...</p>
                )}
            </div>



        </div>
    </>
  )
}



export default RoleDetails