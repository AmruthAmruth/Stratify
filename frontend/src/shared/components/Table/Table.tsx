import React from "react";
import type { TableProps } from "./tableTypes";
import Pagination from "./Pagination";

const Table: React.FC<TableProps> = ({
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
  renderCell,
  actions,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap border-b border-gray-100"
                    >
                      {renderCell ? renderCell(row, col.key) : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-6 py-4 text-center border-b border-gray-100">
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(row)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg shadow-sm transition ${action.type === "delete"
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : action.type === "edit"
                                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                  : action.type === "approve"
                                    ? "bg-green-100 text-primary hover:bg-green-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">No data available</span>
                    <span className="text-xs text-gray-400">
                      There are no records to display
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
