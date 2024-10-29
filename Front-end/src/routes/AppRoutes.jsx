import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ClientPreferencesProvider } from '../context/OrderFlowContext';
import ClientRoutes from './ClientRoutes';
import DashRoutes from './DashRoutes';
import { UserProvider } from '../context/UserContext';

const AppRoutes = () => {
  return (
    <ClientPreferencesProvider>
      <UserProvider>
        <Routes>
          <Route path="/*" element={<ClientRoutes />} /> 
          <Route path="/dash/*" element={<DashRoutes />} /> 
        </Routes>
      </UserProvider>
    </ClientPreferencesProvider>
  );
};

export default AppRoutes;
