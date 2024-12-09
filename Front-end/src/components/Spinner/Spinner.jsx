import React from 'react';
import { Loader } from 'lucide-react';



const Spinner = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <Loader className="w-10 h-10 animate-spin text-black animate-[spin_1.5s_linear_infinite]" />
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

export default Spinner;