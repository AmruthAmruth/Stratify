// components/project/EmployeeList.tsx
import React, { useState, useMemo } from "react";
import Table from "../Table/Table";
import { EmployeeDTO } from "./types";
import TableFilterBar from "../FilterBar/TableFilterBar";

interface Props {
  employees: EmployeeDTO[];
  onRemove: (emp: EmployeeDTO) => void;
}

const EmployeeList: React.FC<Props> = ({ employees, onRemove }) => {
  // -------------------------
  // FILTER & SORT STATES
  // -------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // (Optional) Filter by Position
  const [filterValue, setFilterValue] = useState<string>("");

  // Extract unique positions for dropdown
  const positionOptions = Array.from(
    new Set(employees.map((emp) => emp.position))
  );

  // -------------------------
  // FILTER + SORT LOGIC
  // -------------------------
  const filteredEmployees = useMemo(() => {
    let data = [...employees];

    // Search
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      data = data.filter((emp) =>
        emp.name.toLowerCase().includes(lower)
      );
    }

    // Filter by position
    if (filterValue) {
      data = data.filter((emp) => emp.position === filterValue);
    }

    // Sorting
    if (sortBy) {
      data.sort((a: any, b: any) => {
        if (sortOrder === "asc") {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return b[sortBy].localeCompare(a[sortBy]);
      });
    }

    return data;
  }, [employees, searchTerm, filterValue, sortBy, sortOrder]);

  // -------------------------
  // CLEAR ALL FILTERS
  // -------------------------
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterValue("");
    setSortBy("");
    setSortOrder("asc");
  };

  // -------------------------
  // TABLE COLUMNS & ACTIONS
  // -------------------------
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

      {/* ------------------------- */}
      {/* FILTER BAR */}
      {/* ------------------------- */}
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
        onClearFilters={handleClearFilters}
        filterLabel="All Positions"
        searchPlaceholder="Search employees..."
      />

      {/* ------------------------- */}
      {/* TABLE */}
      {/* ------------------------- */}
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
