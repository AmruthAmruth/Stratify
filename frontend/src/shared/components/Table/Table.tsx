// shared/components/Table/Table.tsx
import React from 'react';
import type { TableProps } from './tableTypes';
import Pagination from './Pagination';

const Table: React.FC<TableProps> = ({ columns, data, currentPage, totalPages, onPageChange }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4 border border-gray-200">
      <div className="min-w-full rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left font-semibold text-gray-700 tracking-wider uppercase"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-gray-800 whitespace-nowrap"
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-6 py-8 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Table;
