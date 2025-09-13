import React, { useEffect, useState } from "react";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import Table from "@/shared/components/Table/Table";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import { addDepartment } from "@/shared/components/Forms/formFields";
import { addDepartmentSchema } from "@/shared/utils/validations";
import {
  createDepartment,
  getAllDepartmentInACompany,
  getUnassignedManager,
} from "@/services/company";
import { useSnackbar } from "notistack";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import { useNavigate } from "react-router-dom";

// Updated interface to match API response
interface DepartmentDetails {
  id: string;
  name: string;
  description?: string;
  managerName: string;
  numOfEmployees: number;
}

interface Manager {
  id: string;
  name: string;
}

const Department: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentDetails[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterManager, setFilterManager] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { enqueueSnackbar } = useSnackbar();

  // ----------------------
  // Add Department Handler
  // ----------------------
  const handleAddDepartment = async (values: any) => {
    setSubmitLoading(true);

    // Prepare payload
    const payload: any = {
      name: values.name,
      description: values.description,
      ...(values.managerId && values.managerId.trim() !== "" && { managerId: values.managerId }),
    };

    try {
      // Create department
      const data = await createDepartment(payload);
      console.log("Response Data", data);

      enqueueSnackbar("Department Created Successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      try {
        const response = await getAllDepartmentInACompany();
        console.log("Refresh Response:", response);
        
        // Updated to handle the actual API response structure
        if (response && Array.isArray(response.response)) {
          setDepartments(response.response);
        } else if (response && Array.isArray(response)) {
          setDepartments(response);
        }
      } catch (refreshErr) {
        console.error("Error refreshing departments:", refreshErr);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error while creating department:", err);

      const errorMessage =
        err?.message || "Failed to create department. Try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

const navigate = useNavigate()

  const handleViewDepartment = (departmentId: string) => {
  navigate(`/department-details/${departmentId}`);
};
  // ----------------------
  // Fetch Departments & Managers
  // ----------------------
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        // Fetch unassigned managers
        const managersResponse = await getUnassignedManager();
        if (Array.isArray(managersResponse?.managers)) {
          setManagers(managersResponse.managers);
        }

        // Fetch department data
        const response = await getAllDepartmentInACompany();
        console.log("Response Data:", response);
        
        // Handle the actual API response structure
        if (response && Array.isArray(response.response)) {
          setDepartments(response.response);
        } else if (response && Array.isArray(response)) {
          setDepartments(response);
        } else {
          console.warn("Unexpected response structure:", response);
          setDepartments([]);
        }
        
      } catch (err) {
        console.error("Error fetching departments:", err);
        setDepartments([]);
        setCompanyName("");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

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
  // Dynamic Form Fields
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
          title="Assigned Managers"
          value={sortedDepartments.filter(dept => dept.managerName !== 'Unassigned').length.toString()}
          subtitle="With Department Heads"
          trend="up"
        />
      </div>

      {/* Table Section */}
      <div className="max-w-8xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {companyName ? `${companyName} Departments` : "Departments"}
          </h2>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Department
          </button>
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
                onClick: (row) =>
                 handleViewDepartment(row.id),
              },
               {
                label: "message",
                type: "approve",
                onClick: (row) =>
                  alert(`Viewing details for ${row.name}`),
              },
               {
                label: "Edit",
                type: "edit",
                onClick: (row) =>
                  alert(`Viewing details for ${row.name}`),
              },
               
            ]}
          />
        )}
      </div>

      {/* Modal with Add Department Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
    </div>
  );
};

export default Department;