import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ClientPreferencesProvider } from '../context/OrderFlowContext';
import ClientRoutes from './ClientRoutes';
import { UserProvider } from '../context/UserContext';
import { CartProvider } from '../context/CartContext';

const AppRoutes = () => {
  return (
    <ClientPreferencesProvider> 
      <UserProvider>
        <CartProvider>
          <Routes>
            <Route path="/*" element={<ClientRoutes />} /> 
          </Routes>
        </CartProvider>
      </UserProvider>
    </ClientPreferencesProvider>
  );
};

export default AppRoutes;
