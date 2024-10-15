import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientRoutes from './ClientRoutes'; // Import Client Routes
import { ClientPreferencesProvider } from '../context/OrderFlowContext'; // Import Language Context

const AppRoutes = () => {
  return (
    <ClientPreferencesProvider>
        <Routes>
          {/* Client Routes */}
          <Route path="/*" element={<ClientRoutes />} /> 
        </Routes>
    </ClientPreferencesProvider>
  );
};

export default AppRoutes;
