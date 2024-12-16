import React from 'react';

const ResponsiveTable = () => {
  const columns = [
    'Name', 'Email', 'Phone', 'Address', 
    'City', 'Country', 'Job', 'Department', 
    'Salary', 'Hire Date'
  ];
  
  const data = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      job: 'Software Engineer',
      department: 'Engineering',
      salary: '$85,000',
      hireDate: '2023-01-15'
    }
  ];

  return (
    <div className="overflow-x-auto max-w-[90vw] lg:max-w-[90vw]">
      <table className="border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th 
                key={column} 
                className="p-3 text-left border-b border-gray-200 font-semibold sticky top-0 bg-gray-100"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={index} 
              className="hover:bg-gray-50 transition-colors overflow-x-auto"
            >
              <td className="p-3 border-b">{row.name}</td>
              <td className="p-3 border-b">{row.email}</td>
              <td className="p-3 border-b">{row.phone}</td>
              <td className="p-3 border-b">{row.address}</td>
              <td className="p-3 border-b">{row.city}</td>
              <td className="p-3 border-b">{row.country}</td>
              <td className="p-3 border-b">{row.job}</td>
              <td className="p-3 border-b">{row.department}</td>
              <td className="p-3 border-b">{row.salary}</td>
              <td className="p-3 border-b">{row.hireDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;