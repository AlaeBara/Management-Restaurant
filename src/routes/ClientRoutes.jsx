import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import {Loader} from 'lucide-react'


// Lazy load components
const Home = lazy(() => import('../modules/Client/Home'));
const OrderSuccess = lazy(() => import('../modules/Client/Components/OrderSuccess/OrderSuccess'));


const Spinner = () => (
  <div className="flex justify-center items-center h-screen w-screen">
    <Loader className='w-12 h-12 animate-spin'/>
  </div>
);

const ClientRoutes = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/commande-succès" element={<OrderSuccess />} />
      </Routes>
    </Suspense>
  );
};

export default ClientRoutes;