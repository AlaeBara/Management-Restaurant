import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, LandPlot } from 'lucide-react';
import style from './TableCarts.module.css';
import TableShape from './TableShap';

const TableCart = () => {
  const navigate = useNavigate();

  const fakeTableData = {
    id: '123',
    label: 'Table 1',
    code: 'TBL001',
    createdAt: '2024-11-01',
    status: 'active',
  };

  const getStatusColors = (status) => {
    switch (status) {
      case 'active':
        return {
          table: 'fill-green-100 stroke-green-500',
          chair: 'fill-green-50 stroke-green-400',
          surface: 'fill-green-50/50',
        };
      case 'inactive':
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

    <>
        <div className={style.zoneCart} onClick={() => navigate(`#`)}  >

            <div className={style.header}>

                <div className={style.zoneInfo}>
                    <h3 className={style.zoneTitle}>Table 1  </h3>
                    <div className={style.shape}>
                        <TableShape colors={getStatusColors(fakeTableData.status)} />
                    </div>
                    <p className={style.zoneLabel}>Code De Table :  tab2 </p>
                    <div className={style.dateInfo}>
                        <span>Créé le: 2024-09-08</span>
                    </div>
                </div>

            </div>

            <div className={`${style.actions}`}>
                <button
                    className={`${style.actionButton} ${style.editButton}`}
                >
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                </button>
                <button
                    className={`${style.actionButton} ${style.deleteButton}`}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </button>
            </div>
        </div>
    
    
    
    </>
  );
};

export default TableCart;
