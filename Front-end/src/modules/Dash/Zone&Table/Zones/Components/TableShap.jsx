// TableShape.js
import React from 'react';

const TableShape = ({ colors }) => {
  const defaultColors = {
    table: 'fill-gray-100 stroke-gray-500',
    chair: 'fill-gray-50 stroke-gray-400',
    surface: 'fill-gray-50/50',
  };

  const tableColors = colors || defaultColors;

  return (
    <svg viewBox="0 0 200 200" style={{width:"200px"}}>
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>
      {/* Four chairs rotated around the table */}
      {[0, 90, 180, 270].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 100 100)`}>
          <g transform="translate(100 45)" filter="url(#shadow)">
            <rect
              x="-12"
              y="-5"
              width="24"
              height="8"
              rx="2"
              className={tableColors.chair}
            />
            <rect
              x="-10"
              y="5"
              width="20"
              height="16"
              rx="2"
              className={tableColors.chair}
            />
          </g>
        </g>
      ))}

      {/* Central table */}
      <g filter="url(#shadow)">
        <circle cx="100" cy="100" r="25" className={tableColors.table} />
        <circle cx="100" cy="100" r="20" className={tableColors.surface} />
        <circle
          cx="100"
          cy="100"
          r="25"
          fill="none"
          className="stroke-current"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </g>
    </svg>
  );
};

export default TableShape;
