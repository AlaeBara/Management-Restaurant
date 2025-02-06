import React , { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashRoutes from './DashRoutes';
import { UserProvider } from '../context/UserContext';
const Login = lazy(() => import('../modules/Dash/LoginPage/Login'));

const AppRoutes = () => {
  return (
    <UserProvider>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="/dash/*" element={<DashRoutes />} /> 
      </Routes>
    </UserProvider>
  );
};

export default AppRoutes;
