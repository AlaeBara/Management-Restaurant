import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ClientPreferencesProvider } from '../context/OrderFlowContext'; // Import Language Context
import ClientRoutes from './ClientRoutes'; // Import Client Routes
import DashRoutes from './DashRoutes'


const AppRoutes = () => {
  return (
    <ClientPreferencesProvider>
        <Routes>
          <Route path="/*" element={<ClientRoutes />} /> 
          <Route path="/dash/*" element={<DashRoutes />} /> 
        </Routes>
    </ClientPreferencesProvider>
  );
};

export default AppRoutes;
