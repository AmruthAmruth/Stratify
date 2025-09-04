import React, { useEffect, useState } from "react";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import Table from "@/shared/components/Table/Table";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import { addDepartmentWithManagerFields } from "@/shared/components/Forms/formFields";
import { addDepartmentSchema } from "@/shared/utils/validations";
import { addDepartmentwithManager, getAllDepartmentInACompany } from "@/services/company";
import { useSnackbar } from "notistack";

interface DepartmentDetails {
  departmentName: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  employeeCount: number;
}

interface CompanyData {
  companyName: string;
  totalDepartments: number;
  totalEmployees: number;
  departments: DepartmentDetails[];
}

const Department: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentDetails[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;
  const [loading, setLoading] = useState<boolean>(false); // for fetching
  const [submitLoading, setSubmitLoading] = useState<boolean>(false); // for adding
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  // Handle adding a department (from modal form)
  const handleAddDepartment = async (values: unknown) => {
    setSubmitLoading(true);
    try {
      const data = await addDepartmentwithManager(values);
      console.log("Response Data ", data);

      enqueueSnackbar("Department and Manager Added Successfully! 🎉", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // refresh department list after adding
      const response = await getAllDepartmentInACompany();
      const companyData: CompanyData | undefined = response?.data;
      if (companyData && Array.isArray(companyData.departments)) {
        setDepartments(companyData.departments);
        setCompanyName(companyData.companyName);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error while creating manager and department", err);
      enqueueSnackbar(err?.error || "Failed to create department. Try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await getAllDepartmentInACompany();

        const data: CompanyData | undefined = response?.data;
        if (!data || !Array.isArray(data.departments)) {
          setDepartments([]);
          setCompanyName("");
          return;
        }

        setDepartments(data.departments);
        setCompanyName(data.companyName);
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

  // Pagination
  const paginatedData = departments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(departments.length / pageSize);

  return (
    <div className="p-6 bg-gray-100">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DashboardCard
          title="Total Employees"
          value={departments.reduce((acc, dept) => acc + dept.employeeCount, 0).toString()}
          subtitle={`Across ${departments.length} Departments`}
          trend="up"
        />
        <DashboardCard
          title="Active Projects"
          value="35"
          subtitle="8 Completed this Month"
          trend="up"
        />
        <DashboardCard
          title="Budget Utilization"
          value="72%"
          subtitle="Q3 Department Spending"
          trend="down"
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
              { key: "departmentName", label: "Department Name" },
              { key: "managerName", label: "Head of Department" },
              { key: "managerPhone", label: "Phone" },
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
                  alert(`Viewing details for ${row.departmentName}`),
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
          fields={addDepartmentWithManagerFields}
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
