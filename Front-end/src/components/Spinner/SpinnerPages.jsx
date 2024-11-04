import React from 'react';
import { Loader } from 'lucide-react';

const SpinnerPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen ">
      <Loader className="w-10 h-10 animate-spin text-black animate-[spin_1.5s_linear_infinite]" />
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

export default SpinnerPage;