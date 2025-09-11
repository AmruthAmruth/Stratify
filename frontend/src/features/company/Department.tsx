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
      // 1️⃣ Create department
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
        
        // You might want to set company name from somewhere else or make it optional
        // setCompanyName(response?.companyName || "Your Company");
        
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
  // Pagination
  // ----------------------
  const paginatedData = departments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(departments.length / pageSize);

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
        { value: "", label: "None" }, // optional "None" option
        ...managers.map((m) => ({ value: m.id, label: m.name })),
      ],
    },
  ];

  // ----------------------
  // Calculate total employees
  // ----------------------
  const totalEmployees = departments.reduce((acc, dept) => acc + dept.numOfEmployees, 0);

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
          subtitle={`Across ${departments.length} Departments`}
          trend="up"
        />
        <DashboardCard
          title="Active Departments"
          value={departments.length.toString()}
          subtitle="Currently Active"
          trend="up"
        />
        <DashboardCard
          title="Assigned Managers"
          value={departments.filter(dept => dept.managerName !== 'Unassigned').length.toString()}
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

        {loading ? (
          <p>Loading departments...</p>
        ) : departments.length === 0 ? (
          <p>No departments found.</p>
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