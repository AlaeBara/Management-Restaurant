import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import style from './TableCarts.module.css';
import TableShape from './TableShap';

const TableCart = ({ table }) => {
  const navigate = useNavigate();

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

  return (
    <div className={style.zoneCart} onClick={() => navigate(`#`)}>
      <div className={style.header}>
        <div className={style.zoneInfo}>
          <h3 className={style.zoneTitle}>{table.tableName}</h3>
          <div className={style.shape}>
            <TableShape colors={getStatusColors(table.tableStatus)} />
          </div>
          <p className={style.zoneLabel}>
            Status : {table.tableStatus === 'available' 
              ? 'Disponible' 
              : table.tableStatus === 'reserved' 
              ? 'Réservée' 
              : table.tableStatus === 'occupied' 
              ? 'Occupée' 
              : 'Inconnu'}
          </p>
          <p className={style.zoneLabel}>Code de Table : {table.tableCode}</p>
          <div className={style.dateInfo}>
            <span>Créé le: {formatDate(table.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className={`${style.actions}`}>
        <button
          className={`${style.actionButton} ${style.editButton}`}
          onClick={() => navigate(`/edit/${table.tableCode}`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Modifier
        </button>
        <button
          className={`${style.actionButton} ${style.deleteButton}`}
          onClick={() => console.log(`Supprimer table: ${table.tableCode}`)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
        </button>
      </div>
    </div>
  );
};

export default TableCart;
