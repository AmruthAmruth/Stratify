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
    <div className="bg-surface border border-borderColor rounded-xl shadow-sm overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-borderColor">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-bold text-heading uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-center text-xs font-bold text-heading uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-surface divide-y divide-borderColor">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-text whitespace-nowrap"
                    >
                      {renderCell ? renderCell(row, col.key) : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(row)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 ${action.type === "delete"
                                ? "bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md"
                                : action.type === "edit"
                                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md"
                                  : action.type === "approve"
                                    ? "bg-green-50 text-primary hover:bg-green-100 hover:shadow-md"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md"
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
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-muted"
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
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-heading">No data available</p>
                      <p className="text-xs text-muted">
                        There are no records to display
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-borderColor bg-gray-50">
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
