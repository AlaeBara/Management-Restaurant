import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Janvier', ventes: 4000 },
  { name: 'Février', ventes: 3000 },
  { name: 'Mars', ventes: 2000 },
  { name: 'Avril', ventes: 2780 },
  { name: 'Mai', ventes: 1890 },
  { name: 'Juin', ventes: 2390 },
];

const Charts = () => {
  return (
    <>
      <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl'>
        <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-100 bg-gray-50 rounded-tl-2xl rounded-tr-2xl p-4 mb-5'>
          <CardTitle className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center'>
            <ChevronRight className='mr-2 text-primary' />
            Charts
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                    formatter={(value) => [`${value} ventes`, 'Ventes']}
                    labelFormatter={(label) => `Mois: ${label}`}
                    />
                    <Legend
                    payload={[
                        { value: 'Ventes', type: 'rect', color: '#8884d8' },
                    ]}
                    />
                    <Bar dataKey="ventes" fill="#8884d8" />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Charts;