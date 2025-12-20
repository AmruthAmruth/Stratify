import React, { useState, useMemo, useEffect } from "react";
import {
  Mail,
  Phone,
  Award,
  ArrowLeft,
  Users,
  Building2
} from "lucide-react";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import ReusableChart from "@/shared/components/Chart/ReusableChart";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import Table from "@/shared/components/Table/Table";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import { createEmployee, getDepartmentDetails, getManagerDepartments } from "@/services/company";
import { addMember } from "@/shared/components/Forms/formFields";
import { addMemberSchema } from "@/shared/utils/validations";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate, useParams } from "react-router-dom";

// TypeScript Interfaces
interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  status?: "Active" | "Inactive";
}

interface DepartmentResponse {
  departmentName: string;
  description: string;
  headOfDepartment: string;
  headEmail: string;
  headPhone: string;
  headPosition: string;
  teamMembers: TeamMember[];
}

interface Department {
  id: string;
  name: string;
  memberCount?: number;
  status?: string;
}

interface DepartmentDetailsPageProps {
  role: "company" | "manager";
}

const DepartmentDetailsPage: React.FC<DepartmentDetailsPageProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepartmentSelectorOpen, setIsDepartmentSelectorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [department, setDepartment] = useState<DepartmentResponse | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(id || "");

  const managerId = useSelector((state: RootState) => state.auth.userId);

  /** Fetch manager departments */
  useEffect(() => {
    if (role === "manager" && managerId) {
      setLoading(true);
      getManagerDepartments(managerId)
        .then((data) => {
          setDepartments((data || []) as Department[]);
          if (data && data.length > 0 && !selectedDepartmentId) {
            setSelectedDepartmentId(data[0].id);
          }
        })
        .catch(() => enqueueSnackbar("Failed to fetch manager departments", { variant: "error" }))
        .finally(() => setLoading(false));
    } else if (role === "company") {
      setLoading(false);
    }
  }, [role, managerId, selectedDepartmentId, enqueueSnackbar]);

  /** Fetch department details */
  useEffect(() => {
    const departmentId = role === "company" ? id : selectedDepartmentId;
    if (departmentId && !loading) {
      getDepartmentDetails(departmentId)
        .then((data) => setDepartment((data.response as unknown) as DepartmentResponse || null))
        .catch(() => enqueueSnackbar("Failed to fetch department details", { variant: "error" }));
    }
  }, [id, selectedDepartmentId, role, loading, enqueueSnackbar]);

  /** Add member handler */
  const handleAddMember = (values: Record<string, unknown>) => {
    const departmentId = role === "company" ? id : selectedDepartmentId;
    if (!departmentId) {
      enqueueSnackbar("No department selected", { variant: "error" });
      return;
    }

    setSubmitLoading(true);
    createEmployee({ ...values, departmentId })
      .then(() => {
        enqueueSnackbar("Member added successfully!", { variant: "success" });
        setIsModalOpen(false);
        return getDepartmentDetails(departmentId);
      })
      .then((refreshed) => setDepartment((refreshed.response as unknown) as DepartmentResponse || null))
      .catch(() => enqueueSnackbar("Failed to add member. Please try again.", { variant: "error" }))
      .finally(() => setSubmitLoading(false));
  };

  /** Department selection for manager */
  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setIsDepartmentSelectorOpen(false);
    if (role === "manager") navigate(`/manager/department/${departmentId}`, { replace: true });
  };

  /** Dynamic data */
  const departmentData = department
    ? {
      name: department.departmentName,
      description: department.description,
      head: {
        name: department.headOfDepartment,
        email: department.headEmail,
        phone: department.headPhone,
        position: department.headPosition,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(department.headOfDepartment)}`,
        experience: 5,
      },
    }
    : null;

  const employeeData = useMemo(() => {
    if (!department?.teamMembers) return [];
    return department.teamMembers.map((m) => ({
      id: m.id,
      name: m.name,
      position: m.position,
      email: m.email,
      phone: m.phone,
      status: m.status || "Active",
    }));
  }, [department]);

  const overviewData = useMemo(() => ({
    totalProjects: 24,
    totalTeamMembers: employeeData.length,
    activeMembers: employeeData.filter((e) => e.status === "Active").length,
    inactiveMembers: employeeData.filter((e) => e.status === "Inactive").length,
  }), [employeeData]);

  const performanceChartData = useMemo(() => ({
    labels: ["Active Projects", "Completed Projects", "Team Members", "Efficiency %"],
    data: [12, 45, employeeData.length, 85],
    backgroundColors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]
  }), [employeeData.length]);

  /** Table Filtering, Sorting, Pagination */
  const filteredEmployees = useMemo(() => {
    let filtered = [...employeeData];
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterValue) filtered = filtered.filter(emp => emp.status === filterValue);
    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a];
        const bVal = b[sortBy as keyof typeof b];
        if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });
    }
    return filtered;
  }, [employeeData, searchTerm, filterValue, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  useEffect(() => setCurrentPage(1), [searchTerm, filterValue, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterValue("");
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const tableColumns = [
    { key: "name", label: "Employee Name" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
  ];

  const renderCell = (row: TeamMember, key: string) => {
    if (key === "status") {
      return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${row.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
          {row.status}
        </span>
      );
    }
    return (row as unknown as Record<string, unknown>)[key] as React.ReactNode;
  };

  const handleBackToDepartments = () => {
    navigate(role === "company" ? "/departments" : "/manager/departments");
  };

  const currentDepartmentName =
    role === "manager"
      ? departments.find((d) => d.id === selectedDepartmentId)?.name || departmentData?.name || "Department"
      : departmentData?.name || "Department";

  /** Loading states */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#009063] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (role === "manager" && departments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Departments Assigned</h2>
          <p className="text-gray-600">You are not assigned to manage any departments yet.</p>
          <button
            onClick={handleBackToDepartments}
            className="mt-4 bg-[#009063] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Not Found</h2>
          <p className="text-gray-600">The requested department details could not be loaded.</p>
          <button
            onClick={handleBackToDepartments}
            className="mt-4 bg-[#009063] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  /** Main content */
  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      {/* Header */}
      <div className="bg-white border-b border-[#dfdcef] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Back Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDepartments}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Departments
              </button>

              <div className="h-6 w-px bg-[#dfdcef]"></div>

              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">Department Details</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${role === "company" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                  {role === "company" ? "Company View" : "Manager View"}
                </span>
              </div>
            </div>

            {/* Department Selector for Manager */}
            {role === "manager" && departments.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setIsDepartmentSelectorOpen(!isDepartmentSelectorOpen)}
                  className="flex items-center space-x-2 bg-white border border-[#dfdcef] rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#f5f5f5] transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{currentDepartmentName}</span>
                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isDepartmentSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#dfdcef] py-2 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Select Department
                    </div>
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => handleDepartmentChange(dept.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-[#f5f5f5] transition-colors ${selectedDepartmentId === dept.id ? "bg-blue-50 text-blue-700" : "text-gray-700"
                          }`}
                      >
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Users className="w-3 h-3 mr-1" />
                          {dept.memberCount} members
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#dfdcef] p-8 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col gap-6">
            <div className="flex items-center mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-[#009063] to-purple-500 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-gray-900">{departmentData?.name}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{departmentData?.description}</p>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#dfdcef] mb-8 overflow-hidden">
          <div className="border-b border-[#dfdcef]">
            <nav className="flex space-x-0">
              {["overview", "team"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-8 font-semibold text-sm transition-all duration-200 relative ${activeTab === tab
                    ? "text-[#009063] bg-[#e6f6f0]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-[#f5f5f5]"
                    }`}
                >
                  {tab === "overview" ? "Overview" : "Team Members"}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009063]"></div>}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "overview" && (
              <div className="space-y-12">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardCard title="Total Projects" value={overviewData.totalProjects} subtitle="All time projects" trend="up" badge="Projects" />
                  <DashboardCard title="Team Members" value={overviewData.totalTeamMembers} subtitle="Total employees" trend="none" badge="People" />
                  <DashboardCard title="Active Members" value={overviewData.activeMembers} subtitle="Currently working" trend="up" badge="Active" />
                  <DashboardCard title="Inactive Members" value={overviewData.inactiveMembers} subtitle="On leave/inactive" trend="down" badge="Inactive" />
                </div>

                {/* Performance Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <ReusableChart
                    type="bar"
                    labels={performanceChartData.labels}
                    data={performanceChartData.data}
                    title="Performance Metrics"
                    backgroundColors={performanceChartData.backgroundColors}
                  />
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-12">
                {/* Department Head */}
                <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl p-8 border border-green-100 shadow-sm">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative">
                      <img src={departmentData?.head.avatar} alt={departmentData?.head.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{departmentData?.head.name}</h4>
                      <p className="text-green-600 font-semibold mb-4">
                        {departmentData?.head.position}
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Department Head</span>
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-700 bg-white rounded-lg p-3 shadow-sm"><Mail className="w-4 h-4 mr-3 text-blue-500" />{departmentData?.head.email}</div>
                        <div className="flex items-center text-gray-700 bg-white rounded-lg p-3 shadow-sm"><Phone className="w-4 h-4 mr-3 text-green-500" />{departmentData?.head.phone}</div>
                        <div className="flex items-center text-gray-700 bg-white rounded-lg p-3 shadow-sm"><Award className="w-4 h-4 mr-3 text-yellow-500" />{departmentData?.head.experience} years</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Table */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">Team Members</h3>
                    <div className="flex items-center gap-4">
                      <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{filteredEmployees.length} Members</div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#009063] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                      >
                        + Add Member
                      </button>
                    </div>
                  </div>

                  <TableFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterOptions={["Active", "Inactive"]}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    sortOptions={[
                      { key: "name", label: "Name" },
                      { key: "position", label: "Position" },
                      { key: "status", label: "Status" }
                    ]}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    onClearFilters={clearFilters}
                    searchPlaceholder="Search employees..."
                    filterLabel="All Status"
                  />

                  <Table
                    columns={tableColumns}
                    data={paginatedEmployees}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    renderCell={renderCell}
                  />
                </div>

                {/* Add Member Modal */}
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Add Member"
                >
                  <AuthForm
                    fields={addMember}
                    validationSchema={addMemberSchema}
                    onSubmit={handleAddMember}
                    buttonText={submitLoading ? "Adding..." : "Add Member"}
                  />
                  {submitLoading && (
                    <div className="flex justify-center mt-4">
                      <div className="w-6 h-6 border-2 border-[#009063] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </Modal>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailsPage;
