import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayoutDash';
import ProtectedRoute from '../ProtectRoutes/ProtectedRouteDash';
import Spinner from '../components/Spinner/SpinnerPages'; 

// Lazy load pages
const Home = lazy(() => import('../modules/Dash/Home/Home'));
const Login = lazy(() => import('../modules/Dash/LoginPage/Login'));
const AllUsers = lazy(() => import('@/modules/Dash/UserManagments/User/AllUsersPage'));
const DeletedUsers = lazy(() => import('@/modules/Dash/UserManagments/User/DeletedUsersPage'));
const Zones1 = lazy(() => import('@/modules/ZoneAndTable/Zones'));
const AddUserForm = lazy(() => import('@/modules/Dash/UserManagments/User/Components/AddUserForm'));
const AllRoles=lazy(() => import('@/modules/Dash/UserManagments/Role/AllRoles'));
const UpdateUserpage = lazy(() => import('@/modules/Dash/UserManagments/User/Components/UpdateUserpage'))
const AddRole = lazy(()=> import ('@/modules/Dash/UserManagments/Role/Components/AddRole'))
const UpdateRole = lazy(()=> import ('@/modules/Dash/UserManagments/Role/Components/UpdateRole'))
const RoleDetails = lazy(()=> import ('@/modules/Dash/UserManagments/Role/RoleDetails'))
const Zones = lazy(()=> import ('@/modules/Dash/Zone&Table/Zones/Zones'))
const AddZone = lazy(()=> import ("@/modules/Dash/Zone&Table/Zones/Components/AddZone"))
const UpdateZone = lazy(()=> import ("@/modules/Dash/Zone&Table/Zones/Components/UpdateZone"))
const DeletedZone = lazy(()=> import('@/modules/Dash/Zone&Table/Zones/Components/DeletedZone'))
const ZoneDetails = lazy(()=>  import ('@/modules/Dash/Zone&Table/Zones/ZoneDetails/ZoneDetails'))
const AddTable = lazy(()=> import('@/modules/Dash/Zone&Table/Zones/ZoneDetails/AddTable'))
const UpdateTable = lazy(()=> import('@/modules/Dash/Zone&Table/Zones/ZoneDetails/UpdateTable'))
const Suplier = lazy(()=> import ("@/modules/Dash/Suplier&Stockage/Suplier/Suplier"))
const AddSuplier = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Suplier/Components/AddSuplier'))
const UpdateSuplier = lazy(()=>import('@/modules/Dash/Suplier&Stockage/Suplier/Components/UpdateSuplier'))
const SuplierDeleted = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Suplier/Components/SuppliersDeleted'))
const Storage = lazy(()=> import ('@/modules/Dash/Suplier&Stockage/Stockage/Storage'))
const AddStorage = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Stockage/Components/AddStorage'))
const UpdateStorage = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Stockage/Components/UpdateStorage'))
const StorageDeleted = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Stockage/Components/StorageDeleted'))
const Tables = lazy(()=>import('@/modules/Dash/Zone&Table/Tables/Tables'))
const TableDeleted = lazy(()=> import('@/modules/Dash/Zone&Table/Zones/ZoneDetails/TableDeleted'))
const Units = lazy(()=> import ('@/modules/Dash/Units/Units'))
const AddUnits = lazy(()=> import('@/modules/Dash/Units/Components/AddUnits'))
const UpdateUnits = lazy(()=>import('@/modules/Dash/Units/Components/UpdateUnits'))
const DeletedUnits = lazy(()=>import('@/modules/Dash/Units/Components/DeletedUnits'))
const RoleDeleted = lazy(()=>import('@/modules/Dash/UserManagments/Role/Components/RoleDeleted'))
const Products =lazy(()=> import('@/modules/Dash/Products/Product'))
const AddProduct = lazy(()=> import('@/modules/Dash/Products/Components/AddProduct'))
const UpdateProduct = lazy(()=> import('@/modules/Dash/Products/Components/UpdateProduct'))
const DeletedProduct = lazy(()=>import('@/modules/Dash/Products/Components/DeletedProduct'))



const ClientRoutes = () => {
  return (
    <Suspense fallback={<Spinner title="Chargement en cours..." />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/Home" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Create-User" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AllUsers />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Deleted-User" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedUsers />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Add-User" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddUserForm />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Update-User/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateUserpage/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Gestion-des-roles" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AllRoles/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Add-Role" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddRole/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Update-Role/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateRole />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Deleted-Role" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Gestion-des-roles/role-details/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleDetails/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/zones" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Zones/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Add-Zone" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddZone/>
              </MainLayout>
            </ProtectedRoute>
          } 
        /> 
        <Route 
          path="/Update-Zone/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateZone/>
              </MainLayout>
            </ProtectedRoute>
          } 
        /> 
        <Route 
          path="/Deleted-Zone" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedZone/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  
        <Route 
          path="/Zone/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ZoneDetails/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Zone/:id/Add-table/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddTable/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Zone/:id/Update-table/:id_table" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateTable/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Zone/:id/Table-deleted" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <TableDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Tables" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Tables/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />


        <Route 
          path="/Supliers" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suplier/>
              </MainLayout>
            </ProtectedRoute>
          } 
        /> 

        <Route 
          path="/Add-Suplier" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddSuplier/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />    

        <Route 
          path="/Update-Suplier/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateSuplier/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />   

        <Route 
          path="/Deleted-Suplier" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <SuplierDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />   


        <Route 
          path="/Storage" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Storage/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  

         <Route 
          path="/Add-Storage" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddStorage/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  

        <Route 
          path="/Update-Storage/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateStorage/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />   

        <Route 
          path="/Deleted-Storage" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <StorageDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />   

        <Route 
          path="/Units" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Units/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  

        <Route 
          path="/Units/Add-Units" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddUnits/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Update-Units/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateUnits/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Deleted-Unites" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedUnits/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Products/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits/Ajouter-Produits" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddProduct/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits/Mettre-à-jour-Produit/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateProduct/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits/produits-supprimés" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedProduct/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Zones and table mock up */}
        <Route 
          path="/zones1" 
          element={
            <MainLayout>
              <Zones1 />
            </MainLayout>
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default ClientRoutes;
