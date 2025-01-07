import React from 'react';

const Carts = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 ">
        <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-medium text-gray-600">Total Purchases</h2>
            <p className="text-3xl font-semibold mt-2">$45,000</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
        <h2 className="text-base font-medium text-gray-600">Remaining Balance</h2>
        <p className="text-3xl font-semibold mt-2">$3,500</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-medium text-gray-600">Last Purchase Date</h2>
            <p className="text-3xl font-semibold mt-2">2023-06-15</p>
        </div>
    </div>
  );
};

export default Carts;