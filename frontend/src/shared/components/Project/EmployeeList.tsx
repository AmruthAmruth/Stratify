// components/project/EmployeeList.tsx
import React from "react";
import Table from "../Table/Table"; 
import { EmployeeDTO } from "./types";

interface Props {
  employees: EmployeeDTO[];
  onRemove: (emp: EmployeeDTO) => void;
}

const EmployeeList: React.FC<Props> = ({ employees, onRemove }) => {
  // Table columns
  const columns = [
    { key: "name", label: "Employee Name" },
    { key: "position", label: "Position" },
  ];

  // Action buttons
  const actions = [
    {
      label: "Remove",
      type: "delete",
      onClick: (row: EmployeeDTO) => onRemove(row),
    },
  ];

  return (
    <div className="mt-4">
      <Table
        columns={columns}
        data={employees}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        actions={actions}
        renderCell={(row, key) => row[key]}
      />
    </div>
  );
};

export default EmployeeList;
