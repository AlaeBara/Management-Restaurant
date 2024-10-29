import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Login from '../modules/Dash/LoginPage/Login';
import MainLayout from '../layouts/MainLayoutDash';
import Home from '../modules/Dash/Home/Home';
import ProtectedRoute from '../ProtectRoutes/ProtectedRouteDash'; 
import CreateUsers from '@/modules/Dash/UserManagments/User/CreateUsers';

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
             <CreateUsers/>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default ClientRoutes;
