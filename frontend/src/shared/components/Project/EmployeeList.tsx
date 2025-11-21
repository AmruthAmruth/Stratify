// components/project/EmployeeList.tsx
import React, { useState, useMemo, useEffect } from "react";
import Table from "../Table/Table";
import { EmployeeDTO } from "./types";
import TableFilterBar from "../FilterBar/TableFilterBar";
import { removeEmployeeInProject } from "@/services/projects";

interface Props {
  employees: EmployeeDTO[];
  projectId: string;
  onRemoveSuccess?: () => void;
}

const EmployeeList: React.FC<Props> = ({ 
  employees = [], 
  projectId,
  onRemoveSuccess 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterValue, setFilterValue] = useState<string>("");
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  // DEBUG: Log projectId when component mounts or projectId changes
  useEffect(() => {
    console.log("EmployeeList - projectId received:", projectId);
    console.log("EmployeeList - projectId type:", typeof projectId);
  }, [projectId]);

  const positionOptions = Array.from(
    new Set((employees ?? []).map((emp) => emp.position))
  );

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

  const columns = [
    { key: "name", label: "Employee Name" },
    { key: "position", label: "Position" },
  ];

  const handleRemoveEmployee = async (employee: EmployeeDTO) => {
    // DEBUG: Log all values before API call
    console.log("=== REMOVE EMPLOYEE DEBUG ===");
    console.log("Employee object:", employee);
    console.log("Employee ID:", employee.id);
    console.log("Project ID:", projectId);
    console.log("============================");

    if (!projectId) {
      alert("Error: Project ID is undefined. Please check console for details.");
      return;
    }

    if (!employee.id) {
      alert("Error: Employee ID is undefined. Please check console for details.");
      return;
    }

    const confirmRemove = window.confirm(
      `Are you sure you want to remove ${employee.name} from this project?`
    );
    
    if (!confirmRemove) return;

    try {
      setIsRemoving(employee.id);
      
      await removeEmployeeInProject({
        employeeId: employee.id,
        projectId: projectId,
      });

      alert(`${employee.name} has been removed from the project.`);
      onRemoveSuccess?.();
      
    } catch (error: any) {
      console.error("Failed to remove employee:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to remove employee. Please try again.";
      alert(message);
    } finally {
      setIsRemoving(null);
    }
  };

  const actions = [
    {
      label: "Remove",
      type: "delete",
      onClick: (row: EmployeeDTO) => handleRemoveEmployee(row),
      disabled: (row: EmployeeDTO) => isRemoving === row.employeeId,
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