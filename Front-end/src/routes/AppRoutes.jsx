import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientRoutes from './ClientRoutes'; // Import Client Routes
import { LanguageProvider } from '../context/LanguageContext'; // Import Language Context
import OfflineNotification from '../components/OfflineNotification'; // Import Offline Notification

const AppRoutes = () => {
  return (
    <LanguageProvider>
      <OfflineNotification>
        <Routes>
          {/* Client Routes */}
          <Route path="/*" element={<ClientRoutes />} /> 
        </Routes>
      </OfflineNotification>
    </LanguageProvider>
  );
};

export default AppRoutes;
