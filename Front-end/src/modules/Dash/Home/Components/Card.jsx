import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white border p-6 rounded-lg transition-shadow duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-2xl font-bold text-gray-900 ${value.includes('+') && 'text-green-600'}`}>{value}</p>
                <h2 className="text-sm font-medium text-gray-500">{title}</h2>
            </div>
            <div className="text-xl border rounded-md p-2 bg-[#f9f9f8]">
                {icon}
            </div>
        </div>
    </div>
  );
};

export default StatCard;