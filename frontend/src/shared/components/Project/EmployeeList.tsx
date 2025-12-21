// components/project/EmployeeList.tsx
import React, { useState, useMemo, useEffect } from "react";
import Table from "../Table/Table";
import { EmployeeDTO } from "./types";
import TableFilterBar from "../FilterBar/TableFilterBar";
import { removeEmployeeInProject } from "@/services/projects";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { enqueueSnackbar } from "notistack";

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

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    employeeName: string;
    employeeId: string;
  }>({ isOpen: false, employeeName: "", employeeId: "" });

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
      data.sort((a: EmployeeDTO, b: EmployeeDTO) => {
        const aValue = a[sortBy as keyof EmployeeDTO];
        const bValue = b[sortBy as keyof EmployeeDTO];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return data;
  }, [employees, searchTerm, filterValue, sortBy, sortOrder]);

  const columns = [
    { key: "name", label: "Employee Name" },
    { key: "position", label: "Position" },
  ];

  const handleRemoveEmployee = (employee: EmployeeDTO) => {
    // DEBUG: Log all values before API call
    console.log("=== REMOVE EMPLOYEE DEBUG ===");
    console.log("Employee object:", employee);
    console.log("Employee ID:", employee.id);
    console.log("Project ID:", projectId);
    console.log("============================");

    if (!projectId || !employee.id) {
      console.error("Missing required IDs");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      employeeName: employee.name,
      employeeId: employee.id,
    });
  };

  const confirmRemoveEmployee = async () => {
    const { employeeId, employeeName } = confirmDialog;
    setConfirmDialog({ isOpen: false, employeeName: "", employeeId: "" });

    try {
      setIsRemoving(employeeId);

      await removeEmployeeInProject({
        employeeId: employeeId,
        projectId: projectId,
      });

      enqueueSnackbar(`${employeeName} has been removed from the project`, { variant: "success" });
      onRemoveSuccess?.();

    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      console.error("Failed to remove employee:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to remove employee. Please try again.";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsRemoving(null);
    }
  };

  const actions = [
    {
      label: "Remove",
      type: "delete" as const,
      onClick: (row: EmployeeDTO) => handleRemoveEmployee(row),
      disabled: (row: EmployeeDTO) => isRemoving === row.employeeId,
    },
  ];

  return (
    <div className="mt-4">
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remove Employee"
        message={`Are you sure you want to remove ${confirmDialog.employeeName} from this project? All their assigned issues will be unassigned.`}
        onConfirm={confirmRemoveEmployee}
        onCancel={() => setConfirmDialog({ isOpen: false, employeeName: "", employeeId: "" })}
        confirmText="Remove"
        cancelText="Cancel"
      />


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
        onPageChange={() => { }}
        actions={actions}
        renderCell={(row, key) => row[key] as React.ReactNode}
      />
    </div>
  );
};

export default EmployeeList;