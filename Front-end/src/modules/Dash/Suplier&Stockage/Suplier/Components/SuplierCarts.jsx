import React, { useState } from 'react';
import style from "./SupliersCarts.module.css";
import { Edit, Trash2} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, Printer, Globe } from 'lucide-react'

const STATUS = {
    ACTIVE : 'ACTIVE',
    INACTIVE : 'INACTIVE',
    BLOCKED : 'BLOCKED',
    
};

const SupplierCard = ({ supplier , Delete }) => {

    const navigate = useNavigate()
    const [isModalVisible, setIsModalVisible] = useState(false);

    const formatDate = (lastLogin) => {
        if (!lastLogin) return "introuvable";
        const date = new Date(lastLogin);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };

    const confirmDelete = (id) => {
        setIsModalVisible(false)
        Delete(id)
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setIsModalVisible(true);
    };

    const cancelDelete = () => {
        setIsModalVisible(false);
        setUserToDelete(null);
    };

    return (
        <>
            <div className={style.userCard}>

                
                <div className={`${style.status} ${style[supplier.status]}`}>
                    {supplier.status === STATUS.ACTIVE ? "Actif" :
                        supplier.status === STATUS.INACTIVE ? "Inactif" :
                        supplier.status === STATUS.BLOCKED ? "Bloqué" :""
                    }
                </div>
               
                <div className={style.headerCart}>
                    <img
                        src="https://e7.pngegg.com/pngimages/931/209/png-clipart-computer-icons-symbol-avatar-logo-person-with-helmut-miscellaneous-black.png"
                        alt="Avatar"
                        className={style.avatar}
                    />
                    <div className={style.userInfo}>
                        <h3>{supplier.name}</h3>
                    </div>
                </div>
                
                <div className={style.email}>
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${supplier.email}`} className="text-sm hover:underline">
                        {supplier.email}
                    </a>
                </div>
                <div className={style.address}>
                    <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    {supplier.address}
                </div>
                <div className={style.phone}>
                    <Phone className="mr-2  h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${supplier.phone}`} className="text-sm hover:underline">
                        {supplier.phone}
                    </a>
                </div>
                <div className={style.fax}>
                    <Printer className="mr-2 h-4 w-4 text-muted-foreground" />
                    {supplier.fax ? (
                        <a href={`tel:${supplier.fax}`} className="text-sm hover:underline">
                        {supplier.fax}
                        </a>
                    ) : (
                        <span className="text-sm text-gray-500">Fax non disponible</span>
                    )}
                </div>

                <div className={style.website}>
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    {supplier.website ? (
                        <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                        >
                        {supplier.website}
                        </a>
                    ) : (
                        <span className="text-sm text-gray-500">Site web non disponible</span>
                    )}
                </div>



                <div className={style.userAction}>
                    <div className={style.btn} onClick={() => navigate(`/dash/Update-Suplier/${supplier.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Mise à Jour
                    </div>

                    <div className={`${style.btn} ${style.delete}`} onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                    </div>
                    
                </div>
            </div>

           


            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all ease-in-out duration-300">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h3>
                            <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer le fournisseur <strong>{supplier.name}</strong> ?</p>
                            <div className="flex justify-end space-x-4">
                            <button 
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                                onClick={cancelDelete}
                            >
                                Annuler
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                onClick={()=>confirmDelete(supplier.id)}
                            >
                                Supprimer
                            </button>
                            </div>
                        </div>
                    </div>
              </div>
            )}


        </>
    );
};

export default SupplierCard;
