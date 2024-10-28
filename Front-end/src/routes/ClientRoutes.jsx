import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Home from '../modules/Client/Home';

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default ClientRoutes;
