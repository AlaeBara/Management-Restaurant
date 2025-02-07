import React from 'react';
import { UsersRound, Box, ShoppingCart, ChartNoAxesColumn } from 'lucide-react';
import StatCard from './Components/Card'; 
import {RevenueChart} from './Components/ChartRevenue';
import {Component} from './Components/OrdersSummary';


const statsData = [
  {
    title: "Total Clients Aujourd'hui",
    value: "89",
    icon: <UsersRound />,
  },
  {
    title: "Total Commandes Aujourd'hui",
    value: "45",
    icon: <Box />,
  },
  {
    title: "Commandes Totales",
    value: "1,234",
    icon: <ShoppingCart />,
  },
  {
    title: "Ratio de Revenu du Jour",
    value: "+15%",
    icon: <ChartNoAxesColumn />,
  },
];

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 font-sans">Tableau de Bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mt-5'>
        <RevenueChart />

        <Component />
      </div>
    </div>
  );
};

export default Home;