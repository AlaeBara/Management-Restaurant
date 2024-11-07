import React, { useEffect, useState } from 'react';
import { useRoles } from './hooks/useRoles';
import { SearchX, UserRoundCog , ExternalLink , Plus , Ban } from 'lucide-react';
import Spinner from '../../../../components/Spinner/Spinner';
import PaginationNav from '../User/Components/PaginationNav';
import RoleCart from './Components/RoleCarts';
import styles from './AllRoles.module.css';
import { useNavigate } from 'react-router-dom';

const AllRoles = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const { roles, totalRoles, loading, error, fetchRoles } = useRoles();

  const totalPages = Math.ceil(totalRoles / limit);

  useEffect(() => {
    fetchRoles(currentPage, limit);
  }, [currentPage, limit, fetchRoles]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalRoles);

  return (
    <>
    
      <div className={styles.Headerpage}>
        <h1 className={styles.title}>Gestion Des Rôles</h1>
      </div>
      
      <div className={styles.Headerpage}>

        <button onClick={() => navigate('#')} className={styles.showdeleteuser}>
            <ExternalLink className="mr-3 h-4 w-4 "/>Les Rôles Supprimés
        </button> 
    
        <button onClick={() => navigate('/dash/Add-Role')} className={styles.showFormButton}>
            <Plus className="mr-3 h-4 w-4 " /> Ajouter un Rôle
        </button> 
      </div>

      <div>

        {loading ? (
          <div className={styles.spinner}>
            <Spinner title="Chargement des rôles..." />
          </div>
        ) : error ? (
          <div className={styles.notfound}>
            <Ban className={styles.icon} />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {roles.length > 0 ? (
              <>
                <div className={styles.total}>
                  <UserRoundCog className="mr-2" />
                  Total des rôles : {totalRoles}
                </div>

                <div className={styles.userGrid}>
                  {roles.map(role => (
                    <RoleCart key={role.id} role={role} />
                  ))}
                </div>

                <PaginationNav
                  currentPage={currentPage}
                  totalPages={totalPages}
                  startItem={startItem}
                  endItem={endItem}
                  numberOfData={totalRoles}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                />
              </>
            ) : (
              <div className={styles.notfound}>
                <SearchX className={styles.icon} />
                <h1>Aucun rôles trouvé</h1>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AllRoles;