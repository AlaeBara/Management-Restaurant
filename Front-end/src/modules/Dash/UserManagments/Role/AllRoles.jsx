import React, { useEffect, useState } from 'react';
import { useRoles } from './hooks/useRoles';
import { SearchX, SquareChartGantt , ExternalLink , Plus , Ban } from 'lucide-react';
import Spinner from '../../../../components/Spinner/Spinner';
import PaginationNav from '../User/Components/PaginationNav';
import RoleCart from './Components/RoleCarts';
import styles from './AllRoles.module.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import axios  from 'axios';

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


    const Delete = async(id) => {
      try {
          const token = Cookies.get('access_token');
          console.log(id);
          const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/roles/${id}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          // Success toast message for role deletion
          toast.success('Le rôle a été supprimé avec succès!', {
            icon: '✅',
            position: "top-right",
            autoClose: 3000,
          });
          fetchRoles(currentPage, limit);
      } catch (error) {
        let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
        console.error('Error deleting role:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message, {
          icon: '❌',
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

  return (
    <>
      <ToastContainer/>
    
      <div className={styles.Headerpage}>
        <h1 className={styles.title}>Gestion Des Rôles</h1>
      </div>
      
      <div className={styles.Headerpage2}>
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
                  <SquareChartGantt className="mr-2" />
                  Total des rôles : {totalRoles}
                </div>

                <div className={styles.userGrid}>
                  {roles.map(role => (
                    <RoleCart key={role.id} role={role} Delete={Delete} />
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