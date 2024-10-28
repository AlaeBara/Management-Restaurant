import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Login from '../modules/Dash/LoginPage/Login';
import MainLayout from '../layouts/MainLayoutDash'
import Home from '../modules/Dash/Home/Home'

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Home" element={<MainLayout><Home/></MainLayout>} />
    </Routes>
  );
};

export default ClientRoutes;
