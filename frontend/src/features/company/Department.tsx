import Table from '@/shared/components/Table/Table';
import React, { useState } from 'react';

const columns = [
  { key: 'name', label: 'Department Name' },
  { key: 'head', label: 'Head of Department' },
  { key: 'employees', label: 'Number of Employees' },
];

const sampleData = [
  { id: 1, name: 'Engineering', head: 'Alice Johnson', employees: 25 },
  { id: 2, name: 'Marketing', head: 'Bob Smith', employees: 15 },
  { id: 3, name: 'Sales', head: 'Charlie Lee', employees: 20 },
  { id: 4, name: 'Human Resources', head: 'Diana Prince', employees: 10 },
  { id: 5, name: 'Finance', head: 'Ethan Wright', employees: 12 },
  { id: 6, name: 'Customer Support', head: 'Fiona Adams', employees: 18 },
  { id: 7, name: 'Research & Development', head: 'George Clark', employees: 14 },
  { id: 8, name: 'IT & Infrastructure', head: 'Hannah Davis', employees: 9 },
  { id: 9, name: 'Operations', head: 'Ian Thompson', employees: 22 },
  { id: 10, name: 'Legal', head: 'Julia Roberts', employees: 6 },
];

const Department = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const paginatedData = sampleData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sampleData.length / pageSize);

  return (
    <div className="p-6 bg-gray-100 ">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Departments</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => alert('Add Department Clicked!')}
          >
            + Add Department
          </button>
        </div>
        <Table
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Department;
