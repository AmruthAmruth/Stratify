import React, { useState, useMemo, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  Award, 
  MessageCircle, 
  Eye, 
  ArrowLeft,
  Users,
  Building2
} from "lucide-react";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import ReusableChart from "@/shared/components/Chart/ReusableChart";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import Table from "@/shared/components/Table/Table";
import { createEmployee, getDepartmentDetails, getManagerDepartments } from "@/services/company";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import { addMember } from "@/shared/components/Forms/formFields";
import { addMemberSchema } from "@/shared/utils/validations";
import { useSnackbar } from "notistack";
import { RootState } from "@/store";

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
  memberCount: number;
  status: string;
}

interface DepartmentDetailsPageProps {
  role: 'company' | 'manager';
}

const DepartmentDetailsPage: React.FC<DepartmentDetailsPageProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDepartmentSelectorOpen, setIsDepartmentSelectorOpen] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState<DepartmentResponse | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(id || "");

  // Dummy data for manager departments (multiple departments a manager handles)
  
 const managerId = (state: RootState) => state.auth.userId;

 useEffect(() => {
  if (role === "manager" && managerId) {
    getManagerDepartments(managerId)
      .then((data) => {
        setDepartments(data || []); // ✅ store departments
        if (data.length > 0 && !selectedDepartmentId) {
          setSelectedDepartmentId(data[0].id); // default to first department
        }
      })
      .catch((err) => {
        console.error("Error fetching manager departments:", err);
      });
  }
}, [role, managerId]);


  const managerDepartments: Department[] = [
    { id: "1", name: "Engineering", memberCount: 12, status: "Active" },
    { id: "2", name: "Product Development", memberCount: 8, status: "Active" },
    { id: "3", name: "Quality Assurance", memberCount: 6, status: "Active" },
  ];

  // Dummy department data if API fails or for demo
  const dummyDepartment: DepartmentResponse = {
    departmentName: role === 'manager' ? 
      (managerDepartments.find(d => d.id === selectedDepartmentId)?.name || "Engineering") :
      "Engineering Department",
    description: "Our engineering team is responsible for developing and maintaining our core products and services. We focus on innovation, quality, and scalable solutions.",
    headOfDepartment: "Sarah Johnson",
    headEmail: "sarah.johnson@company.com",
    headPhone: "+1 (555) 123-4567",
    headPosition: "VP of Engineering",
    teamMembers: [
      { id: "1", name: "John Doe", position: "Senior Developer", email: "john.doe@company.com", phone: "+1 (555) 123-4568", status: "Active" },
      { id: "2", name: "Jane Smith", position: "Frontend Developer", email: "jane.smith@company.com", phone: "+1 (555) 123-4569", status: "Active" },
      { id: "3", name: "Mike Wilson", position: "Backend Developer", email: "mike.wilson@company.com", phone: "+1 (555) 123-4570", status: "Active" },
      { id: "4", name: "Lisa Brown", position: "DevOps Engineer", email: "lisa.brown@company.com", phone: "+1 (555) 123-4571", status: "Inactive" },
      { id: "5", name: "David Lee", position: "QA Engineer", email: "david.lee@company.com", phone: "+1 (555) 123-4572", status: "Active" },
    ]
  };

  // Fetch department details
  useEffect(() => {
    const departmentId = role === 'company' ? id : selectedDepartmentId;
    if (departmentId) {
      getDepartmentDetails(departmentId)
        .then((data) => {
          setDepartment(data.response);
        })
        .catch((err) => {
          console.error("Error while fetching department:", err);
          // Use dummy data as fallback
          setDepartment(dummyDepartment);
        });
    } else {
      // Use dummy data if no ID
      setDepartment(dummyDepartment);
    }
  }, [id, selectedDepartmentId, role]);

  const handleAddMember = (values: any) => {
    const departmentId = role === 'company' ? id : selectedDepartmentId;
    if (!departmentId) return;

    setSubmitLoading(true);

    const payload = {
      ...values,
      departmentId: departmentId,
    };

    createEmployee(payload)
      .then((data) => {
        console.log("Member added successfully:", data);
        enqueueSnackbar("Member added successfully!", { variant: "success" });
        setIsModalOpen(false);
        // Refresh department details
        getDepartmentDetails(departmentId)
          .then((refreshedData) => setDepartment(refreshedData.response))
          .catch((err) => {
            console.error("Error refreshing department:", err);
            // Add to dummy data for demo
            if (department) {
              const newMember = {
                id: Date.now().toString(),
                name: values.name,
                position: values.position,
                email: values.email,
                phone: values.phone,
                status: "Active" as const
              };
              setDepartment({
                ...department,
                teamMembers: [...department.teamMembers, newMember]
              });
            }
          });
      })
      .catch((err) => {
        console.error("Error creating employee:", err.message);
        enqueueSnackbar("Failed to add member. Please try again.", { variant: "error" });
        
        // For demo purposes, still add to dummy data
        if (department) {
          const newMember = {
            id: Date.now().toString(),
            name: values.name,
            position: values.position,
            email: values.email,
            phone: values.phone,
            status: "Active" as const
          };
          setDepartment({
            ...department,
            teamMembers: [...department.teamMembers, newMember]
          });
          enqueueSnackbar("Member added successfully! (Demo mode)", { variant: "success" });
          setIsModalOpen(false);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setIsDepartmentSelectorOpen(false);
    // Update URL for manager
    if (role === 'manager') {
      navigate(`/manager/department/${departmentId}`, { replace: true });
    }
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
          experience: 5,
        },
      }
    : null;

  // Dynamic employee data
  const employeeData = useMemo(() => {
    if (!department?.teamMembers) return [];
    return department.teamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      position: member.position,
      email: member.email,
      phone: member.phone,
      status: member.status || "Active",
    }));
  }, [department]);

  // Overview data
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

  // Filter and sort logic
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

  const handleViewProfile = (profileId: string) => {
    const basePath = role === 'company' ? '' : '/manager';
    navigate(`${basePath}/team-member-profile/${profileId}`);
  };

  const tableActions = [
    {
      type: "edit",
      label: "View More",
      onClick: (row: any) => handleViewProfile(row.id)
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
  
  const handleBackToDepartments = () => {
    const backPath = role === 'company' ? '/departments' : '/manager/departments';
    navigate(backPath);
  };

  // Get current department name for manager view
  const currentDepartmentName = role === 'manager' 
    ? managerDepartments.find(dept => dept.id === selectedDepartmentId)?.name || departmentData?.name || 'Department'
    : departmentData?.name || 'Department';

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
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {role === 'company' ? 'Department Details' : 'My Department'}
                </h1>
                {role === 'company' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Company View
                  </span>
                )}
                {role === 'manager' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Manager View
                  </span>
                )}
              </div>
            </div>

            {/* Department Selector for Manager */}
            {role === 'manager' && managerDepartments.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setIsDepartmentSelectorOpen(!isDepartmentSelectorOpen)}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{currentDepartmentName}</span>
                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isDepartmentSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Select Department
                    </div>
                    {managerDepartments.map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => handleDepartmentChange(dept.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedDepartmentId === dept.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
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
                    {role === 'manager' && (
                      <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        You manage this department
                      </span>
                    )}
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
                      <p className="text-green-600 font-semibold mb-4">
                        {departmentData.head.position}
                        {role === 'manager' && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Department Head
                          </span>
                        )}
                      </p>
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