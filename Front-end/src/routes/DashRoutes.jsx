import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import MainLayout from '../layouts/MainLayoutDash';
import ProtectedRoute from '../ProtectRoutes/ProtectedRouteDash'; 


//Pages
import Home from '../modules/Dash/Home/Home';
import Login from '../modules/Dash/LoginPage/Login';
import AllUsers from '@/modules/Dash/UserManagments/User/AllUsersPage';
import DeletedUsers from '@/modules/Dash/UserManagments/User/DeletedUsersPage';
import Zones from '@/modules/ZoneAndTable/Zones';

const ClientRoutes = () => {
  return (
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
             <AllUsers/>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Deleted-User" 
        element={
          <ProtectedRoute>
            <MainLayout>
             <DeletedUsers/>
            </MainLayout>
          </ProtectedRoute>
        } 
      />



      {/* zones and table mock up  */}
      <Route 
        path="/zones" 
        element={
            <MainLayout>
              <Zones/>
            </MainLayout>
        } 
      />

    </Routes>
  );
};

export default ClientRoutes;
