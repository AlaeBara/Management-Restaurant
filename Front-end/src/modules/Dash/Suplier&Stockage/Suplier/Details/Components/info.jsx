import React from 'react';
import styles from './info.module.css';
import { formatDate } from '@/components/dateUtils/dateUtils';
import {MapPin, Phone, Printer , Mail, Globe, Info, Shield, CreditCard, Calendar , ExternalLink} from 'lucide-react';


const InfoSupplier = ({ supplier }) => {
    const STATUS = {
        ACTIVE: 'ACTIVE',
        INACTIVE: 'INACTIVE',
        BLOCKED: 'BLOCKED',
    };

    return (
        <>
            <div className={styles.ProduitDetails}>
                <h1>Informations du Fournisseur :</h1>
                <div className={styles.ProduitCart}>
                    {supplier && (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="text-center mt-4">
                                <img
                                    src={supplier.logo?.localPath ? `${import.meta.env.VITE_BACKEND_URL}${supplier.logo.localPath}` : "https://e7.pngegg.com/pngimages/931/209/png-clipart-computer-icons-symbol-avatar-logo-person-with-helmut-miscellaneous-black.png"}
                                    alt={supplier.name}
                                    className="w-24 h-24 rounded-full mx-auto"
                                />
                                <p className="mt-2 text-xl font-semibold">{supplier.name}</p>
                            </div>

                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Address */}
                                <div className="flex items-center space-x-4">
                                    <MapPin className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Adresse :</span>
                                        <p>
                                            {supplier.address ? (
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(supplier.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline flex items-center space-x-2"
                                                >
                                                    {supplier.address} 
                                                    <ExternalLink className="ml-2 w-4 h-4"/>
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center space-x-4">
                                    <Phone className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Téléphone :</span>
                                        <p>
                                        {supplier.phone ? (
                                            <a href={`tel:${supplier.phone}`} className="hover:underline">
                                            {supplier.phone}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                        </p>
                                    </div>
                                </div>

                                {/* Fax */}
                                <div className="flex items-center space-x-4">
                                    <Printer  className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Fax :</span>
                                        <p>
                                        {supplier.fax ? (
                                            <a href={`tel:${supplier.fax}`} className="hover:underline">
                                            {supplier.fax}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center space-x-4">
                                    <Mail className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Email :</span>
                                        <p>
                                            {supplier.email ? (
                                                <a href={`mailto:${supplier.email}`} className="hover:underline">
                                                {supplier.email}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Website */}
                                <div className="flex items-center space-x-4">
                                    <Globe className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Site Web :</span>
                                        <p>
                                        {supplier.website ? (
                                            <a href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`} target="_blank"  className="hover:underline">
                                                {supplier.website}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex items-center space-x-4">
                                    <Info className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Description :</span>
                                        <p>{supplier.description || '-'}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center space-x-4">
                                    <Shield className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Statut :</span>
                                        <p className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            supplier.status === STATUS.ACTIVE ? 'bg-green-100 text-green-800' :
                                            supplier.status === STATUS.INACTIVE ? 'bg-yellow-100 text-yellow-800' :
                                            supplier.status === STATUS.BLOCKED ? 'bg-red-100 text-red-800' : ''
                                        }`}>
                                        {supplier.status === STATUS.ACTIVE
                                            ? 'Actif'
                                            : supplier.status === STATUS.INACTIVE
                                            ? 'Inactif'
                                            : supplier.status === STATUS.BLOCKED
                                            ? 'Bloqué'
                                            : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* RC Number */}
                                <div className="flex items-center space-x-4">
                                    <CreditCard className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Numéro RC :</span>
                                        <p>{supplier.rcNumber || '-'}</p>
                                    </div>
                                </div>

                                {/* ICE Number */}
                                <div className="flex items-center space-x-4">
                                    <CreditCard className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Numéro ICE :</span>
                                        <p>{supplier.iceNumber || '-'}</p>
                                    </div>
                                </div>

                                
                                <div className="flex items-center space-x-4">
                                    <Calendar className="w-5 h-5 text-black-600" />
                                    <div>
                                        <span className="font-semibold">Date de création :</span>
                                        <p>{formatDate(supplier.createdAt)}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default InfoSupplier;












// import React from 'react';
// import styles from './info.module.css';
// import { formatDate } from '@/components/dateUtils/dateUtils';

// const Info = ({ supplier }) => {
//     const STATUS = {
//         ACTIVE: 'ACTIVE',
//         INACTIVE: 'INACTIVE',
//         BLOCKED: 'BLOCKED',
//     };

//     return (
//         <>
//             <div className={styles.ProduitDetails}>
//                 <h1>Informations du Fournisseur :</h1>
//                 <div className={styles.ProduitCart}>
//                     {supplier && (
//                         <div className={styles.ProduitInfo}>
//                             {true && (
//                                 <div className={styles.infoItem}>
//                                     <span className={styles.label}>logo :</span>
//                                     <img
//                                         src='https://e7.pngegg.com/pngimages/931/209/png-clipart-computer-icons-symbol-avatar-logo-person-with-helmut-miscellaneous-black.png'
//                                         alt={`${supplier.name}`}
//                                         className={styles.supplierImage}
//                                     />
//                                 </div>
//                             )}
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Nom du Fournisseur :</span>
//                                 <p>{supplier.name}</p>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Adresse :</span>
//                                 <h2>{supplier.address || '-'}</h2>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Téléphone :</span>
//                                 <h2>{supplier.phone || '-'}</h2>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Fax :</span>
//                                 <h2>{supplier.fax || '-'}</h2>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Email :</span>
//                                 <h2>{supplier.email || '-'}</h2>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Site Web :</span>
//                                 <p>
//                                     {supplier.website ? (
//                                         <a href={supplier.website} target="_blank" rel="noopener noreferrer">
//                                             {supplier.website}
//                                         </a>
//                                     ) : (
//                                         '-'
//                                     )}
//                                 </p>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Description :</span>
//                                 <p>{supplier.description || '-'}</p>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Statut :</span>
//                                 <p className={`${styles.status} ${styles[supplier.status]}`}>
//                                     {supplier.status === STATUS.ACTIVE
//                                         ? 'Actif'
//                                         : supplier.status === STATUS.INACTIVE
//                                         ? 'Inactif'
//                                         : supplier.status === STATUS.BLOCKED
//                                         ? 'Bloqué'
//                                         : ''}
//                                 </p>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Numéro RC :</span>
//                                 <p>{supplier.rcNumber || '-'}</p>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Numéro ICE :</span>
//                                 <p>{supplier.iceNumber || '-'}</p>
//                             </div>
//                             <div className={styles.infoItem}>
//                                 <span className={styles.label}>Date de création :</span>
//                                 <p>{formatDate(supplier.createdAt)}</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Info;












