import React, { useEffect, useState } from 'react';
import style from './RoleDeleted.module.css'
import { useNavigate } from 'react-router-dom'
import {Ban, SearchX} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRolesDeleted} from "../Hooks/useFetchRoleDeleted"
import PaginationNav from '../../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import { useRestoreRole } from '../Hooks/useRetoreRole';
import RoleCartDeleted from './RoleCartsDeleted'


const DeletedRole = () => {
    const  navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { roles, totalRoles, loading, error, fetchRoles } = useRolesDeleted();

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

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
      }
    }, [totalPages, currentPage]);

    const {RestoreRole} = useRestoreRole(fetchRoles)
    

  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Historique Des Rôles Supprimés</h1>
                <p className="text-base text-gray-600 mt-0">Consultez l'historique des rôles supprimées de votre plateforme. Vous pouvez visualiser les rôles qui ont été supprimées et les restaurer si nécessaire.</p>
            </div>
        </div>

        {/* carts of zone deleted */}

        <div>

            {loading ? (
            <div className={style.spinner}>
                <Spinner title="Chargement des Rôles Supprimés..." />
            </div>
            ) : error ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{error}</span>
            </div>
            ) : (
                <>
                    {roles.length > 0 ? (
                    <>

                        <div className={style.userGrid}>
                        {roles.map(role => (
                            <RoleCartDeleted key={role.id} role={role}  Restore={RestoreRole}/>
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
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Rôles  Supprimés trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>




    </div>
  )
}

export default DeletedRole