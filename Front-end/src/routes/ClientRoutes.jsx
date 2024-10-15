import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Home from '../modules/Client/Home'; // Import Home component

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  {/* Home route */}
    </Routes>
  );
};

export default ClientRoutes;
