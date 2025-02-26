import React , { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashRoutes from './DashRoutes';
import { UserProvider } from '../context/UserContext';
import { ServeurProvider } from '../context/ServeurContext';
const Login = lazy(() => import('../modules/Dash/LoginPage/Login'));


const AppRoutes = () => {
  return (
    <UserProvider>
      <ServeurProvider>
        <Routes> 
          <Route path="/" element={<Login />} />
          <Route path="/dash/*" element={<DashRoutes />} /> 
        </Routes>
      </ServeurProvider>
    </UserProvider>
  );
};

export default AppRoutes;
