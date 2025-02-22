import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircleCheck } from 'lucide-react';
import successAnimation from './AnimationSucces.json';
import Lottie from 'lottie-react';

const OrderSuccess = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve orderDetails from the navigation state
    const orderDetails = location.state?.orderDetails || {};
    const handleReturnHome = () => {
        navigate('/');
    };

  return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 text-center max-w-md w-full">
            
            <div className="flex justify-center">
                <Lottie animationData={successAnimation} loop={true} style={{ width: 150, height: 150 }} />
            </div>

            <h1 className="text-3xl font-bold mb-4">
                {t('Order Successful')}
            </h1>
            <p className="text-gray-700 text-lg mb-4">{orderDetails.message}</p>
            <p className="text-gray-600 mb-2">
                <span className="font-semibold">{t('Order Number')}:</span>{' '}
                {orderDetails.orderNumber}
            </p>

            <div className="flex justify-center mt-5">
                <button
                    className="bg-[#2d3748] text-white px-6 py-3 rounded-lg transition duration-300"
                    onClick={handleReturnHome}
                >
                    {t('Return to Home')}
                </button>
            </div>
        </div>
    </div>
  );
};

export default OrderSuccess;