import React, { useState, useEffect } from 'react';
import style from "./CartShiftZone.module.css";
import { LandPlot } from 'lucide-react';
import { useUserContext } from '../../../../context/UserContext';

const ZoneCart = ({ zone, StartShift, EndShift }) => {
    const { user } = useUserContext();
    
    // Console logs at component render
    console.log('zone:', zone);
    console.log('user:', user);

    // Optional: Log when zone or user changes
    useEffect(() => {
        console.log('zone updated:', zone);
        console.log('user updated:', user);
    }, [zone, user]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedZone, setSelectedZone] = useState(null);

    const statuses = [
        { key: 'ASSIGNED', label: 'Attribué', className: style.assigned },
        { key: 'AVAILABLE', label: 'Disponible', className: style.available }
    ];

    const getStatusDetails = (statusKey) => {
        return statuses.find((item) => item.key === statusKey) || { label: statusKey, className: '' };
    };

    const handleModal = (type, zone) => {
        setModalType(type);
        setSelectedZone(zone);
        setIsModalVisible(true);
    };

    const handleAction = () => {
        if (modalType === 'start') {
            StartShift(selectedZone.id);
        } else if (modalType === 'end') {
            EndShift(selectedZone.id);
        }
        setIsModalVisible(false);
    };

    return (
        <>
            <div className={style.zoneCart}>
                <h1 className={style.nameOfZone}>
                    <LandPlot className="mr-2" />
                    {zone.zoneLabel}
                </h1>

                <div className={style.zone}>
                    <div className={style.zoneInfo1}>
                        <p className={style.zoneItem}>Statut de la zone :</p>
                        <p className={`${style.zoneStatus} ${getStatusDetails(zone.status).className}`}>
                            {getStatusDetails(zone.status).label}
                        </p>
                    </div>

                    <div className={style.zoneInfo2}>
                        <p className={style.zoneItem}>Serveur actuel :</p>
                        <p className={style.zoneLabel}>
                            {zone?.currentWaiter?.firstname && zone?.currentWaiter?.lastname
                                ? `${zone.currentWaiter.firstname} ${zone.currentWaiter.lastname}`
                                : '-'}
                        </p>
                        {user.permissions.includes("access-granted") ? null : (
                            <div className={`${style.actions}`}>
                                {zone?.currentWaiter?.id && zone?.currentWaiter?.id !== user.sub && user.permissions.includes("request-shift-reassignment-by-waiter") ? (
                                    <button
                                        className={`${style.actionButton} ${style.editButton} md:whitespace-nowrap`}
                                        onClick={() => handleModal('request', zone)}
                                    >
                                        Demander
                                    </button>
                                ) : zone.currentWaiterId === user.sub ? (
                                    <button
                                        className={`${style.actionButton} ${style.editButton} md:whitespace-nowrap`}
                                        onClick={() => handleModal('end', zone)}
                                    >
                                        Fin de service
                                    </button>
                                ) : (
                                    <button
                                        className={`${style.actionButton} ${style.editButton} md:whitespace-nowrap`}
                                        onClick={() => handleModal('start', zone)}
                                    >
                                        Début de service
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {modalType === 'start'
                                ? 'Confirmer le début de service'
                                : modalType === 'end'
                                ? 'Confirmer la fin de service'
                                : 'Confirmer la demande'}
                        </h3>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir {modalType === 'start'
                                ? 'commencer votre service'
                                : modalType === 'end'
                                ? 'terminer votre service'
                                : 'envoyer une demande'}{' '}
                            pour la zone "{selectedZone?.zoneLabel}" ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleAction}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ZoneCart;
