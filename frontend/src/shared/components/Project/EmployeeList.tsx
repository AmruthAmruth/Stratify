// components/project/EmployeeList.tsx
import React, { useState, useMemo } from "react";
import Table from "../Table/Table";
import { EmployeeDTO } from "./types";
import TableFilterBar from "../FilterBar/TableFilterBar";

interface Props {
  employees: EmployeeDTO[];
  onRemove: (emp: EmployeeDTO) => void;
}

const EmployeeList: React.FC<Props> = ({ employees = [], onRemove }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterValue, setFilterValue] = useState<string>("");

  // Unique positions
  const positionOptions = Array.from(
    new Set((employees ?? []).map((emp) => emp.position))
  );

  // FILTER + SORT
  const filteredEmployees = useMemo(() => {
    let data = [...(employees ?? [])];

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      data = data.filter((e) => e.name.toLowerCase().includes(lower));
    }

    if (filterValue) {
      data = data.filter((e) => e.position === filterValue);
    }

    if (sortBy) {
      data.sort((a: any, b: any) =>
        sortOrder === "asc"
          ? a[sortBy].localeCompare(b[sortBy])
          : b[sortBy].localeCompare(a[sortBy])
      );
    }

    return data;
  }, [employees, searchTerm, filterValue, sortBy, sortOrder]);

  // COLUMNS
  const columns = [
    { key: "name", label: "Employee Name" },
    { key: "position", label: "Position" },
  ];

  const actions = [
    {
      label: "Remove",
      type: "delete",
      onClick: (row: EmployeeDTO) => onRemove(row),
    },
  ];

  return (
    <div className="mt-4">

      <TableFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOptions={positionOptions}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        sortOptions={[
          { key: "name", label: "Employee Name" },
          { key: "position", label: "Position" },
        ]}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onClearFilters={() => {
          setSearchTerm("");
          setFilterValue("");
          setSortBy("");
          setSortOrder("asc");
        }}
        filterLabel="All Positions"
        searchPlaceholder="Search employees..."
      />

      <Table
        columns={columns}
        data={filteredEmployees}
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
