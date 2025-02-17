import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lottie from 'lottie-react';
import SpinnerLottie from './Spinner.json'; 


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// const Home = lazy(() => import('../modules/Client/Home'));
// const OrderSuccess = lazy(() => import('../modules/Client/Components/OrderSuccess/OrderSuccess'));

const Home = lazy(() => delay(2000).then(() => import('../modules/Client/Home')));
const OrderSuccess = lazy(() => delay(2000).then(() => import('../modules/Client/Components/OrderSuccess/OrderSuccess')));

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Lottie animationData={SpinnerLottie} loop={true} autoplay={true} style={{ height: 150, width: 150 }} />
    </div>
  );
};

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