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
const Zones = lazy(() => import('@/modules/ZoneAndTable/Zones'));
const AddUserForm = lazy(() => import('@/modules/Dash/UserManagments/User/Components/AddUserForm'));
const AllRoles=lazy(() => import('@/modules/Dash/UserManagments/Role/AllRoles'));
const UpdateUserpage = lazy(() => import('@/modules/Dash/UserManagments/User/Components/UpdateUserpage'))
const AddRole = lazy(()=> import ('@/modules/Dash/UserManagments/Role/Components/AddRole'))
const UpdateRole = lazy(()=> import ('@/modules/Dash/UserManagments/Role/Components/UpdateRole'))

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
















        {/* Zones and table mock up */}
        <Route 
          path="/zones" 
          element={
            <MainLayout>
              <Zones />
            </MainLayout>
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default ClientRoutes;
