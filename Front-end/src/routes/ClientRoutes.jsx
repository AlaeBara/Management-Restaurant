import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Home from '../modules/Client/Home';
import NotFound from '../components/404/PageNotFounds'


const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoutes;
