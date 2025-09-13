import React, { useState, useMemo, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  Award, 
  MessageCircle, 
  Eye, 
  ArrowLeft
} from "lucide-react";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import ReusableChart from "@/shared/components/Chart/ReusableChart";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import Table from "@/shared/components/Table/Table";
import { createEmployee, getDepartmentDetails } from "@/services/company";
import { useParams } from "react-router-dom";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import { addMember } from "@/shared/components/Forms/formFields";
import { addMemberSchema } from "@/shared/utils/validations";
import { useSnackbar } from "notistack";
// TypeScript Interfaces
interface TeamMember {
  name: string;
  position: string;
  email: string;
  phone: string;
  status?: "Active" | "Inactive"; // optional, default to Active
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

const DepartmentDetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

 const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<DepartmentResponse | null>(null);

  useEffect(() => {
    if (id) {
      getDepartmentDetails(id)
        .then((data) => {
          // API response has a "response" key
          setDepartment(data.response);
        })
        .catch((err) => console.error("Error while fetching department:", err));
    }
  }, [id]);




const handleAddMember = (values: any) => {
  if (!id) return;

  setSubmitLoading(true);

  const payload = {
    ...values,
    departmentId: id,
  };

  console.log("Adding new member with departmentId:", payload);

  createEmployee(payload)
    .then((data) => {
      console.log("After Creation success:", data);
       enqueueSnackbar("Member added successfully!", { variant: "success" });
      setIsModalOpen(false); // close modal if you want
    })
    .catch((err) => {
      console.error("Error creating employee:", err.message);
       enqueueSnackbar("Failed to add member. Please try again.", { variant: "error" });
    })
    .finally(() => {
      setSubmitLoading(false); // stop spinner
    });
};




  // Dynamic department data
  const departmentData = department
    ? {
        name: department.departmentName,
        description: department.description,
        head: {
          name: department.headOfDepartment,
          email: department.headEmail,
          phone: department.headPhone,
          position: department.headPosition,
          avatar:
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(department.headOfDepartment),
          experience: 5, // fallback value
        },
      }
    : null;






  // Dynamic employee data
  const employeeData = useMemo(() => {
    if (!department?.teamMembers) return [];
    return department.teamMembers.map((member, idx) => ({
      id: idx + 1,
      name: member.name,
      position: member.position,
      email: member.email,
      phone: member.phone,
      status: member.status || "Active",
    }));
  }, [department]);

  // Dummy overview and performance chart (can be dynamic later)
  const overviewData = {
    totalProjects: 24,
    totalTeamMembers: employeeData.length,
    activeMembers: employeeData.filter((e) => e.status === "Active").length,
    inactiveMembers: employeeData.filter((e) => e.status === "Inactive").length,
  };

  const performanceChartData = {
    labels: ["Active Projects", "Completed Projects", "Team Members", "Efficiency %"],
    data: [12, 45, employeeData.length, 85],
    backgroundColors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]
  };

  // Filter and sort
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
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];
        if (sortOrder === "asc") return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
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
    { key: "status", label: "Status" }
  ];

  const tableActions = [
    {
      type: "edit",
      label: "View More",
      onClick: (row: any) => console.log("View employee:", row)
    },
    {
      type: "approve",
      label: "Message",
      onClick: (row: any) => console.log("Message employee:", row)
    }
  ];

  const renderCell = (row: any, key: string) => {
    if (key === "status") {
      return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          row[key] === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {row[key]}
        </span>
      );
    }
    return row[key];
  };

  const handleMessage = () => console.log("Message department head");
  const handleViewMore = () => console.log("View more department head details");
  const handleBackToDepartments = () => console.log("Navigate back to departments");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToDepartments}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Departments
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-3xl font-bold text-gray-900">Department Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col gap-8">
            {departmentData ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
                    <h2 className="text-3xl font-bold text-gray-900">{departmentData.name}</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">{departmentData.description}</p>
                </div>
              </>
            ) : (
              <p>Loading department details...</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-4 px-8 font-semibold text-sm transition-all duration-200 relative ${
                  activeTab === "overview" ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Overview
                {activeTab === "overview" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`flex-1 py-4 px-8 font-semibold text-sm transition-all duration-200 relative ${
                  activeTab === "team" ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Team Members
                {activeTab === "team" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
              </button>
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
                  <ReusableChart type="bar" labels={performanceChartData.labels} data={performanceChartData.data} title="Performance Metrics" backgroundColors={performanceChartData.backgroundColors} />
                </div>
              </div>
            )}

            {activeTab === "team" && departmentData && (
              <div className="space-y-12">
               
                {/* Department Head */}
                <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl p-8 border border-green-100 shadow-sm">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative">
                      <img src={departmentData.head.avatar} alt={departmentData.head.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{departmentData.head.name}</h4>
                      <p className="text-green-600 font-semibold mb-4">{departmentData.head.position}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-700 bg-white rounded-lg p-3 shadow-sm"><Mail className="w-4 h-4 mr-3 text-blue-500" />{departmentData.head.email}</div>
                        <div className="flex items-center text-gray-700 bg-white rounded-lg p-3 shadow-sm"><Phone className="w-4 h-4 mr-3 text-green-500" />{departmentData.head.phone}</div>
                        <div className="flex items-center text-gray-700 bg-white rounded-lg p-3 shadow-sm"><Award className="w-4 h-4 mr-3 text-yellow-500" />{departmentData.head.experience} years</div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={handleMessage} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm">Message</button>
                      <button onClick={handleViewMore} className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all duration-200">View Profile</button>
                    </div>
                  </div>
                </div>




                {/* Team Table */}
                <div>
  <div className="flex items-center justify-between mb-8">
    <h3 className="text-2xl font-bold text-gray-900">Team Members</h3>
    <div className="flex items-center gap-4">
      <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
        {filteredEmployees.length} Members
      </div>
      {/* Add Member Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
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
    actions={tableActions}
    renderCell={renderCell}
  />
</div>


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
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
