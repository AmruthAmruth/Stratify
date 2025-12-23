import React, { useEffect, useState } from "react";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import Table from "@/shared/components/Table/Table";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import { addDepartment, addManager } from "@/shared/components/Forms/formFields";
import { addDepartmentSchema } from "@/shared/utils/validations";
import {
  createDepartment,
  createManager,
  getAllDepartmentInACompany,
  getUnassignedDepartments,
  getUnassignedManager,
} from "@/services/company";
import { TeamMember } from "@/types/types";
import { useSnackbar } from "notistack";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import { useNavigate } from "react-router-dom";


interface DepartmentDetails {
  id: string;
  name: string;
  description?: string;
  managerName: string;
  numOfEmployees: number;
  [key: string]: unknown;
}

interface Manager {
  id: string;
  name: string;
}

interface UnassignedDepartment {
  id: string;
  name: string;
  description?: string;
}

interface DepartmentFormValues {
  name: string;
  description?: string;
  managerId?: string;
}

interface ManagerFormValues {
  name: string;
  email: string;
  departmentId?: string;
  [key: string]: unknown;
}

const Department: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentDetails[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // Separate modal states
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState<boolean>(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);

  const [managers, setManagers] = useState<Manager[]>([]);
  const [unassignedDepartments, setUnassignedDepartments] = useState<UnassignedDepartment[]>([]);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterManager, setFilterManager] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { enqueueSnackbar } = useSnackbar();

  // ----------------------
  // Fetch Unassigned Departments
  // ----------------------
  const fetchUnassignedDepartments = async () => {
    try {
      const response = await getUnassignedDepartments();
      console.log("Unassigned Departments Response:", response);

      // Handle the response structure based on your API
      const deptResp = response as { departments?: UnassignedDepartment[] } | UnassignedDepartment[];
      if (deptResp && 'departments' in deptResp && Array.isArray(deptResp.departments)) {
        setUnassignedDepartments(deptResp.departments);
      } else if (Array.isArray(deptResp)) {
        setUnassignedDepartments(deptResp);
      } else {
        console.warn("Unexpected unassigned departments response structure:", response);
        setUnassignedDepartments([]);
      }
    } catch (err) {
      console.error("Error fetching unassigned departments:", err);
      setUnassignedDepartments([]);
    }
  };

  // ----------------------
  // Add Department Handler
  // ----------------------

  const handleAddDepartment = async (values: Record<string, unknown>) => {
    setSubmitLoading(true);

    const formValues = values as unknown as DepartmentFormValues;

    // Prepare payload
    const payload = {
      name: formValues.name,
      description: formValues.description,
      ...(formValues.managerId && formValues.managerId.trim() !== "" && { managerId: formValues.managerId }),
    };

    try {
      // Create department
      const data = await createDepartment(payload);
      console.log("Response Data", data);

      enqueueSnackbar("Department Created Successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // Refresh all data after creating department
      try {
        const [departmentsResponse, managersResponse] = await Promise.all([
          getAllDepartmentInACompany(),
          getUnassignedManager()
        ]);

        // Update departments
        const deptData2 = departmentsResponse as { response?: DepartmentDetails[] } | DepartmentDetails[];
        if (deptData2 && 'response' in deptData2 && Array.isArray(deptData2.response)) {
          setDepartments(deptData2.response);
        } else if (Array.isArray(deptData2)) {
          setDepartments(deptData2 as DepartmentDetails[]);
        }

        // Update managers
        const managersData2 = managersResponse as { managers?: TeamMember[] };
        if (managersData2 && Array.isArray(managersData2.managers)) {
          setManagers(managersData2.managers);
        }

        // Refresh unassigned departments as the new department might be unassigned
        await fetchUnassignedDepartments();

      } catch (refreshErr) {
        console.error("Error refreshing data:", refreshErr);
      }

      setIsDepartmentModalOpen(false);
      setIsDepartmentModalOpen(false);
    } catch (err: unknown) {
      console.error("Error while creating department:", err);

      const errorMessage =
        (err as Error)?.message || "Failed to create department. Try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // ----------------------
  // Add Manager Handler (Updated)
  // ----------------------

  const handleAddManager = async (values: Record<string, unknown>) => {
    setSubmitLoading(true);

    const formValues = values as unknown as ManagerFormValues;

    try {
      // Build payload
      const payload = {
        ...formValues,
        ...(formValues.departmentId?.trim() && { departmentId: formValues.departmentId }),
      };

      // Create manager
      const data = await createManager(payload);
      console.log("Manager added successfully", data);

      enqueueSnackbar("Manager Added Successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // Refresh managers + departments
      try {
        const [managersResponse, departmentsResponse] = await Promise.all([
          getUnassignedManager(),
          getAllDepartmentInACompany(),
        ]);

        const managersData3 = managersResponse as { managers?: TeamMember[] };
        if (managersData3 && Array.isArray(managersData3.managers)) {
          setManagers(managersData3.managers);
        }

        const deptData3 = departmentsResponse as { response?: DepartmentDetails[] } | DepartmentDetails[];
        if (deptData3 && 'response' in deptData3 && Array.isArray(deptData3.response)) {
          setDepartments(deptData3.response);
        } else if (Array.isArray(deptData3)) {
          setDepartments(deptData3 as DepartmentDetails[]);
        }

        await fetchUnassignedDepartments();
      } catch (refreshErr) {
        console.error("Error refreshing data:", refreshErr);
      }

      setIsManagerModalOpen(false);
    } catch (err: unknown) {
      console.error("Error while adding manager:", err);

      const error = err as { message?: string };
      const errorMessage = error?.message || "Failed to add manager. Try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setSubmitLoading(false);
    }
  };


  const navigate = useNavigate();

  const handleViewDepartment = (departmentId: string) => {
    navigate(`/department-details/${departmentId}`);
  };

  // ----------------------
  // Fetch Initial Data
  // ----------------------
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [managersResponse, departmentsResponse] = await Promise.all([
          getUnassignedManager(),
          getAllDepartmentInACompany()
        ]);

        // Update managers
        const managersData = managersResponse as { managers?: TeamMember[] };
        if (managersData && Array.isArray(managersData.managers)) {
          setManagers(managersData.managers);
        }

        // Update departments
        const deptData = departmentsResponse as { response?: DepartmentDetails[] } | DepartmentDetails[];
        if (deptData && 'response' in deptData && Array.isArray(deptData.response)) {
          setDepartments(deptData.response);
        } else if (Array.isArray(deptData)) {
          setDepartments(deptData as DepartmentDetails[]);
        } else {
          console.warn("Unexpected departments response structure:", departmentsResponse);
          setDepartments([]);
        }

        // Fetch unassigned departments
        await fetchUnassignedDepartments();

      } catch (err) {
        console.error("Error fetching initial data:", err);
        setDepartments([]);
        setManagers([]);
        setUnassignedDepartments([]);
        setCompanyName("");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // ----------------------
  // Fetch unassigned departments when manager modal opens
  // ----------------------
  useEffect(() => {
    if (isManagerModalOpen) {
      fetchUnassignedDepartments();
    }
  }, [isManagerModalOpen]);

  // ----------------------
  // Search and Filter Logic
  // ----------------------
  const filteredDepartments = departments.filter((dept) => {
    // Search filter
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Manager filter
    const matchesManager = !filterManager || dept.managerName === filterManager;

    return matchesSearch && matchesManager;
  });

  // ----------------------
  // Sorting Logic
  // ----------------------
  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    if (!sortBy) return 0;

    let aValue, bValue;
    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "managerName":
        aValue = a.managerName.toLowerCase();
        bValue = b.managerName.toLowerCase();
        break;
      case "numOfEmployees":
        aValue = a.numOfEmployees;
        bValue = b.numOfEmployees;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // ----------------------
  // Pagination (updated to use filtered/sorted data)
  // ----------------------
  const paginatedData = sortedDepartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(sortedDepartments.length / pageSize);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterManager, sortBy, sortOrder]);

  // ----------------------
  // Clear Filters
  // ----------------------
  const clearFilters = () => {
    setSearchTerm("");
    setFilterManager("");
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  // ----------------------
  // Get unique managers for filter dropdown
  // ----------------------
  const uniqueManagers = [...new Set(departments.map(dept => dept.managerName))].sort();

  // ----------------------
  // Dynamic Form Fields for Department
  // ----------------------
  const departmentFormFields = [
    ...addDepartment,
    {
      name: "managerId",
      label: "Assign Manager (optional)",
      type: "select",
      options: [
        { value: "", label: "None" },
        ...managers.map((m) => ({ value: m.id, label: m.name })),
      ],
    },
  ];

  // ----------------------
  // Dynamic Form Fields for Manager (UPDATED to use unassigned departments)
  // ----------------------
  const managerFormFields = [
    ...addManager,
    {
      name: "departmentId",
      label: "Assign to Department (optional)",
      type: "select",
      options: [
        { value: "", label: "No Department" },
        ...unassignedDepartments.map((dept) => ({
          value: dept.id,
          label: dept.name
        })),
      ],
    },
  ];

  // ----------------------
  // Calculate total employees (updated to use filtered data)
  // ----------------------
  const totalEmployees = sortedDepartments.reduce((acc, dept) => acc + dept.numOfEmployees, 0);

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="p-6 bg-gray-100">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DashboardCard
          title="Total Employees"
          value={totalEmployees.toString()}
          subtitle={`Across ${sortedDepartments.length} Departments${searchTerm || filterManager ? ' (filtered)' : ''}`}
          trend="up"
        />
        <DashboardCard
          title="Active Departments"
          value={sortedDepartments.length.toString()}
          subtitle={`Total: ${departments.length} departments`}
          trend="up"
        />
        <DashboardCard
          title="Unassigned Departments"
          value={unassignedDepartments.length.toString()}
          subtitle="Without Managers"
          trend={unassignedDepartments.length > 0 ? "down" : "up"}
        />
      </div>

      {/* Table Section */}
      <div className="max-w-8xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {companyName ? `${companyName} Departments` : "Departments"}
          </h2>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm"
              onClick={() => setIsDepartmentModalOpen(true)}
            >
              + Add Department
            </button>
            <button
              className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primaryHover transition-all shadow-sm"
              onClick={() => setIsManagerModalOpen(true)}
            >
              + Add Manager
            </button>
          </div>
        </div>

        <TableFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterOptions={uniqueManagers}
          filterValue={filterManager}
          setFilterValue={setFilterManager}
          sortOptions={[
            { key: "name", label: "Department Name" },
            { key: "managerName", label: "Manager Name" },
            { key: "numOfEmployees", label: "Employee Count" },
          ]}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onClearFilters={clearFilters}
        />

        {/* Results Info */}
        {(searchTerm || filterManager) && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {sortedDepartments.length} of {departments.length} departments
            {searchTerm && (
              <span className="ml-1">
                matching "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
            {filterManager && (
              <span className="ml-1">
                with manager "<span className="font-medium">{filterManager}</span>"
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading departments...</span>
            </div>
          </div>
        ) : sortedDepartments.length === 0 ? (
          <div className="text-center py-8">
            {departments.length === 0 ? (
              <div>
                <p className="text-gray-500 text-lg">No departments found.</p>
                <p className="text-gray-400 text-sm mt-1">Create your first department to get started.</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-lg">No departments match your search criteria.</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        ) : (
          <Table
            columns={[
              { key: "name", label: "Department Name" },
              { key: "managerName", label: "Head of Department" },
              { key: "numOfEmployees", label: "Employees" },
              { key: "description", label: "Description" },
            ]}
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            actions={[
              {
                label: "View More",
                type: "custom",
                onClick: (row) => handleViewDepartment(row.id),
              },
              {
                label: "message",
                type: "approve",
                onClick: (row) => alert(`Viewing details for ${row.name}`),
              },
              {
                label: "Edit",
                type: "edit",
                onClick: (row) => alert(`Viewing details for ${row.name}`),
              },
            ]}
          />
        )}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        title="Add Department"
      >
        <AuthForm
          fields={departmentFormFields}
          validationSchema={addDepartmentSchema}
          onSubmit={handleAddDepartment}
          buttonText={submitLoading ? "Adding..." : "Add Department"}
        />
        {submitLoading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </Modal>

      {/* Add Manager Modal (UPDATED) */}
      <Modal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        title="Add Manager"
      >
        <AuthForm
          fields={managerFormFields}
          validationSchema={addDepartmentSchema} // You might want to create a separate schema for managers
          onSubmit={handleAddManager}
          buttonText={submitLoading ? "Adding..." : "Add Manager"}
        />
        {submitLoading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Show available departments info */}
        {unassignedDepartments.length === 0 ? (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ All departments currently have managers assigned.
              You can still add a manager without assigning to a department.
            </p>
            <div className="text-xs text-gray-600 mt-2">
              <p>Debug info:</p>
              <p>• Unassigned departments count: {unassignedDepartments.length}</p>
              <p>• Total departments: {departments.length}</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              ℹ️ {unassignedDepartments.length} department{unassignedDepartments.length !== 1 ? 's' : ''} available for assignment:
            </p>
            <div className="text-xs text-blue-700 mt-1">
              {unassignedDepartments.map((dept, index) => (
                <span key={dept.id}>
                  {dept.name}
                  {index < unassignedDepartments.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Department;