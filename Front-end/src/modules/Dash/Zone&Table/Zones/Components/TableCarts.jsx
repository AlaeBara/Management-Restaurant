import React , {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import style from './TableCarts.module.css';
import TableShape from './TableShap';

const TableCart = ({ table , Delete}) => {
  const navigate = useNavigate();
  const {id} = useParams()

  const [isModalVisible, setIsModalVisible] = useState(false);

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
  const handleEdit = (idd, e) => {
    e.stopPropagation();
    navigate(`/dash/Zone/${id}/Update-table/${idd}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsModalVisible(true);
  };
  const confirmDelete = (id) => {
    setIsModalVisible(false)
    Delete(id)
};


  return (
    <>
      <div className={style.zoneCart} onClick={() => navigate(`#`)}>
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

        <div className={`${style.actions}`}>
          <button
            className={`${style.actionButton} ${style.editButton}`}
            onClick={(e) => handleEdit(table.id, e)}
          >
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </button>
          <button
            className={`${style.actionButton} ${style.deleteButton}`}
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </button>
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
                <p className="mb-4">
                    Êtes-vous sûr de vouloir supprimer la Table "{table?.tableName}" ?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setIsModalVisible(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={()=>confirmDelete(table.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
      )}
  </>
)
};

export default TableCart;
