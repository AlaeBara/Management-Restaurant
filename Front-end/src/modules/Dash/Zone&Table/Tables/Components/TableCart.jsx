import React , {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import style from './TableCart.module.css';
import TableShape from '../../Zones/Components/TableShap';

const TableCart = ({ table}) => {
  const navigate = useNavigate();

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return "introuvable";
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
  };


  // Map API statuses to styles
  const getStatusColors = (status) => {
    switch (status) {
      case 'available':
        return {
          table: 'fill-green-100 stroke-green-500',
          chair: 'fill-green-50 stroke-green-400',
          surface: 'fill-green-50/50',
        };
      case 'reserved':
        return {
          table: 'fill-red-100 stroke-red-500',
          chair: 'fill-red-50 stroke-red-400',
          surface: 'fill-red-50/50',
        };
      case 'occupied':
        return {
          table: 'fill-gray-100 stroke-gray-500',
          chair: 'fill-gray-50 stroke-gray-400',
          surface: 'fill-gray-50/50',
        };
      default:
        return {};
    }
  };

  const handleShowInfo = () => {
    setIsInfoVisible(true); 
  };
  


  return (
    <>
      <div className={style.zoneCart} onClick={handleShowInfo}>
        <div className={style.header}>
          <div className={style.zoneInfo}>
            <h3 className={style.zoneTitle}>{table.tableName}</h3>
            <div className={style.shape}>
              <TableShape colors={getStatusColors(table.tableStatus)} />
            </div>
            <p className={style.zoneLabel}>
              <span className={style.blacktext}>Status :</span> {table.tableStatus === 'available' 
                ? 'Disponible' 
                : table.tableStatus === 'reserved' 
                ? 'Réservée' 
                : table.tableStatus === 'occupied' 
                ? 'Occupée' 
                : 'Inconnu'}
            </p>
            <p className={style.zoneLabel}><span className={style.blacktext}>État de la Table : </span>{table.isActive === true ? "Actif" : "Inactif"}

            </p>
            <p className={style.zoneLabel}><span className={style.blacktext}>Code de Table :</span> {table.tableCode}</p>
            <div className={style.zoneLabel}>
              <span><span className={style.blacktext}>Créé le :</span> {formatDate(table.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {isInfoVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-lg font-semibold">Détails de la Table</h3>
              <button
                onClick={() => setIsInfoVisible(false)}
                className="text-gray-700 focus:outline-none"
              >
                <X />
              </button>
            </div>
            <div className="space-y-2">
              <p><strong>Code de Table :</strong> {table.tableCode}</p>
              <p><strong>Nom de Table :</strong> {table.tableName}</p>
              <p><strong>Statut : </strong>
                {table.tableStatus === 'available'
                  ? 'Disponible'
                  : table.tableStatus === 'reserved'
                  ? 'Réservée'
                  : table.tableStatus === 'occupied'
                  ? 'Occupée'
                  : 'Inconnu'}
              </p>
              <p><strong>État : </strong> {table.isActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Créée le : </strong> {formatDate(table.createdAt)}</p>
              <div className="flex justify-center my-4">
                <img
                  src={table.qrcode}
                  alt="QR Code"
                   className="w-35 h-35 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      
  </>
)
};

export default TableCart;
