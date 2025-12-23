// import React, { useEffect, useState } from "react";
// import { Users, UserCheck, Crown, Mail, Phone, Search, Filter, Plus, Download, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
// import Table from "@/shared/components/Table/Table";
// import Modal from "@/shared/components/ModalFrom/ModalForm";
// import AuthForm from "@/shared/components/Forms/DynamicForm";
// import { addMemberSchema } from "@/shared/utils/validations";
// import { createEmployee } from "@/services/company";
// import { enqueueSnackbar } from "notistack";
// interface TeamMember {
//   id: string;
//   name: string;
//   role: "Manager" | "Employee";
//   email: string;
//   phone: string;
//   team: string;
//   avatar?: string;
//   status: "active" | "inactive" | "suspended";
//   joinDate: string;
//   department: string;
//   position: string;
//   dob: string;
// }

// const dummyTeamData: TeamMember[] = [
//   {
//     id: "1",
//     name: "John Doe",
//     role: "Manager",
//     email: "john@company.com",
//     phone: "9876543210",
//     team: "Engineering",
//     status: "active",
//     joinDate: "2023-01-15",
//     department: "Technology",
//     position: "Engineering Manager",
//     dob: "1985-05-15",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: "2",
//     name: "Sarah Lee",
//     role: "Employee",
//     email: "sarah@company.com",
//     phone: "8765432109",
//     team: "Engineering",
//     status: "active",
//     joinDate: "2023-03-20",
//     department: "Technology",
//     position: "Senior Developer",
//     dob: "1990-08-22",
//     avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: "3",
//     name: "Michael Smith",
//     role: "Manager",
//     email: "michael@company.com",
//     phone: "7654321098",
//     team: "Marketing",
//     status: "active",
//     joinDate: "2022-11-10",
//     department: "Sales & Marketing",
//     position: "Marketing Manager",
//     dob: "1982-12-03",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: "4",
//     name: "Emily Davis",
//     role: "Employee",
//     email: "emily@company.com",
//     phone: "6543210987",
//     team: "Marketing",
//     status: "active",
//     joinDate: "2023-06-05",
//     department: "Sales & Marketing",
//     position: "Marketing Specialist",
//     dob: "1992-04-18",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: "5",
//     name: "David Johnson",
//     role: "Employee",
//     email: "david@company.com",
//     phone: "5432109876",
//     team: "Engineering",
//     status: "suspended",
//     joinDate: "2023-02-28",
//     department: "Technology",
//     position: "Junior Developer",
//     dob: "1995-01-10",
//     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: "6",
//     name: "Lisa Chen",
//     role: "Manager",
//     email: "lisa@company.com",
//     phone: "4321098765",
//     team: "Design",
//     status: "inactive",
//     joinDate: "2022-08-12",
//     department: "Creative",
//     position: "Design Manager",
//     dob: "1988-07-25",
//     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
//   }
// ];

// // Dashboard Card Component
// const DashboardCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
//   <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
//     <div className="flex items-center justify-between">
//       <div className="flex items-center space-x-4">
//         <div className={`p-4 rounded-xl ${color} shadow-lg`}>
//           <Icon className="h-6 w-6 text-white" />
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{title}</p>
//           <p className="text-3xl font-bold text-heading mt-1">{value}</p>
//           <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
//         </div>
//       </div>
//       <div className="flex items-center text-primary">
//         <span className="text-sm font-bold bg-green-100 px-2 py-1 rounded-lg">+12%</span>
//       </div>
//     </div>
//   </div>
// );

// // Utility functions for table formatting
// const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric' 
//   });
// };

// const TeamPage: React.FC = () => {
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>(dummyTeamData);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [filterRole, setFilterRole] = useState<string>("All");
//   const [filterTeam, setFilterTeam] = useState<string>("All");
//   const [filterStatus, setFilterStatus] = useState<string>("All");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const pageSize = 9;

//   // Filtering logic
//   const filteredData = teamMembers.filter((member) => {
//     const nameMatch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const emailMatch = member.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const roleMatch = filterRole === "All" || member.role === filterRole;
//     const teamMatch = filterTeam === "All" || member.team === filterTeam;
//     const statusMatch = filterStatus === "All" || member.status === filterStatus;
    
//     return (nameMatch || emailMatch) && roleMatch && teamMatch && statusMatch;
//   });

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );
//   const totalPages = Math.ceil(filteredData.length / pageSize);

//   const handleAction = (member) => {
//     console.log("Action for:", member.name);
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setFilterRole("All");
//     setFilterTeam("All");
//     setFilterStatus("All");
//     setCurrentPage(1);
//   };

//   // Handle adding new team member with proper error handling and notifications
//   const handleAddMemberSubmit = async (values: unknown) => {
//     setSubmitLoading(true);
//     try {
//       // Prepare payload with proper date formatting as in your example
//       const formData = values as any;
//       const payload = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         position: formData.position,
//         status: formData.status,
//         dob: new Date(formData.dob),
//         joiningDate: new Date(formData.joinDate),
//         avatar: formData.avatar
//       };

//       const data = await createEmployee(payload);
//       console.log("Response Data ", data);

//       enqueueSnackbar("Employee Added Successfully! 🎉", {
//         variant: "success",
//         anchorOrigin: { vertical: "top", horizontal: "right" },
//       });

//       // Create new member object from API response or form data
//       const newMember: TeamMember = {
//         id: data?.id || (teamMembers.length + 1).toString(),
//         name: formData.name,
//         role: formData.position.toLowerCase().includes('manager') ? "Manager" : "Employee",
//         email: formData.email,
//         phone: formData.phone,
//         team: "Engineering", // You might want to add this field to your form
//         department: "Technology", // You might want to add this field to your form
//         position: formData.position,
//         status: formData.status,
//         joinDate: formData.joinDate,
//         dob: formData.dob,
//         avatar: formData.avatar
//       };

//       // Update team members list
//       setTeamMembers([...teamMembers, newMember]);
//       setIsAddModalOpen(false);

//     } catch (err: any) {
//       console.error("Error while creating employee", err);
//       enqueueSnackbar(err?.error || "Failed to create employee. Try again.", {
//         variant: "error",
//         anchorOrigin: { vertical: "top", horizontal: "right" },
//       });
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-heading mb-2">Team Management</h1>
//               <p className="text-gray-700">Manage your company's team members and organizational structure</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm">
//                 <Download className="h-5 w-5" />
//                 <span>Export</span>
//               </button>
//               <button 
//                 onClick={() => setIsAddModalOpen(true)}
//                 className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
//               >
//                 <Plus className="h-5 w-5" />
//                 <span>Add Member</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Dashboard Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <DashboardCard
//             icon={Users}
//             title="Total Members"
//             value={teamMembers.length.toString()}
//             subtitle="Active team members"
//             trend="up"
//             color="bg-blue-600"
//           />
//           <DashboardCard
//             icon={Crown}
//             title="Managers"
//             value={teamMembers.filter((m) => m.role === "Manager").length.toString()}
//             subtitle="Leadership roles"
//             trend="up"
//             color="bg-amber-600"
//           />
//           <DashboardCard
//             icon={UserCheck}
//             title="Active Members"
//             value={teamMembers.filter((m) => m.status === "active").length.toString()}
//             subtitle="Currently working"
//             trend="up"
//             color="bg-primary"
//           />
//           <DashboardCard
//             icon={Users}
//             title="Departments"
//             value={[...new Set(teamMembers.map((t) => t.department))].length.toString()}
//             subtitle="Company divisions"
//             trend="up"
//             color="bg-purple-600"
//           />
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             {/* Search Bar */}
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search members by name or email..."
//                 className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-heading font-medium transition-all duration-200"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>

//             {/* Filters */}
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <Filter className="h-5 w-5 text-gray-600" />
//                 <span className="text-sm font-semibold text-gray-800">Filters:</span>
//               </div>
              
//               <select
//                 className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-heading font-medium min-w-[140px] transition-all duration-200"
//                 value={filterRole}
//                 onChange={(e) => {
//                   setFilterRole(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value="All">All Roles</option>
//                 <option value="Manager">Managers</option>
//                 <option value="Employee">Employees</option>
//               </select>

//               <select
//                 className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-heading font-medium min-w-[140px] transition-all duration-200"
//                 value={filterTeam}
//                 onChange={(e) => {
//                   setFilterTeam(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value="All">All Teams</option>
//                 {[...new Set(teamMembers.map((t) => t.team))].map((team) => (
//                   <option key={team} value={team}>
//                     {team}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-heading font-medium min-w-[140px] transition-all duration-200"
//                 value={filterStatus}
//                 onChange={(e) => {
//                   setFilterStatus(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value="All">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//                 <option value="suspended">Suspended</option>
//               </select>

//               <button
//                 onClick={resetFilters}
//                 className="px-6 py-4 text-sm font-bold text-gray-700 hover:text-heading bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Results Summary */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-4">
//             <p className="text-gray-800 font-medium">
//               Showing <span className="font-bold text-heading text-lg">{filteredData.length}</span> of{" "}
//               <span className="font-bold text-heading text-lg">{teamMembers.length}</span> members
//             </p>
//             {(searchTerm || filterRole !== "All" || filterTeam !== "All" || filterStatus !== "All") && (
//               <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold border-2 border-blue-200">
//                 Filters Applied
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Team Members Table */}
//         <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
//           <div className="p-8 border-b-2 border-gray-100">
//             <h2 className="text-2xl font-bold text-heading">Team Members</h2>
//             <p className="text-gray-700 mt-2 font-medium">Manage and view all team member information</p>
//           </div>

//           {filteredData.length === 0 ? (
//             <div className="text-center py-16">
//               <Users className="h-20 w-20 text-gray-400 mx-auto mb-6" />
//               <h3 className="text-xl font-bold text-heading mb-3">No team members found</h3>
//               <p className="text-gray-700 mb-6 font-medium">Try adjusting your search or filter criteria</p>
//               <button
//                 onClick={resetFilters}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="p-8">
//               <Table
//                 columns={[
//                   { 
//                     key: "memberInfo", 
//                     label: "Member",
//                     render: (member) => (
//                       <div className="flex items-center space-x-4">
//                         <div className="relative">
//                           <img
//                             src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=6366f1&color=fff&size=150`}
//                             alt={member.name}
//                             className="w-10 h-10 rounded-full object-cover"
//                           />
//                           <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                             member.status === 'active' 
//                               ? 'bg-primary' 
//                               : member.status === 'suspended'
//                               ? 'bg-yellow-400'
//                               : 'bg-gray-400'
//                           }`}></div>
//                         </div>
//                         <div>
//                           <div className="text-sm font-bold text-heading">{member.name}</div>
//                           <div className="text-sm font-medium text-gray-600">{member.department}</div>
//                         </div>
//                       </div>
//                     )
//                   },
//                   { 
//                     key: "role", 
//                     label: "Role",
//                     render: (member) => (
//                       <div className="flex items-center space-x-2">
//                         {member.role === 'Manager' && <Crown className="h-4 w-4 text-amber-500" />}
//                         <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
//                           member.role === 'Manager' 
//                             ? 'bg-amber-100 text-amber-800 border-2 border-amber-200' 
//                             : 'bg-blue-100 text-blue-800 border-2 border-blue-200'
//                         }`}>
//                           {member.role}
//                         </span>
//                       </div>
//                     )
//                   },
//                   { 
//                     key: "contact", 
//                     label: "Contact",
//                     render: (member) => (
//                       <div className="space-y-1">
//                         <div className="flex items-center space-x-2 text-sm text-heading">
//                           <Mail className="h-3 w-3 text-gray-400" />
//                           <span>{member.email}</span>
//                         </div>
//                         <div className="flex items-center space-x-2 text-sm text-gray-500">
//                           <Phone className="h-3 w-3 text-gray-400" />
//                           <span>{member.phone}</span>
//                         </div>
//                       </div>
//                     )
//                   },
//                   { key: "team", label: "Team" },
//                   { 
//                     key: "status", 
//                     label: "Status",
//                     render: (member) => (
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                         member.status === 'active' 
//                           ? 'bg-green-100 text-primaryHover' 
//                           : member.status === 'suspended'
//                           ? 'bg-yellow-100 text-yellow-700'
//                           : 'bg-gray-100 text-gray-700'
//                       }`}>
//                         <div className={`w-2 h-2 rounded-full mr-2 ${
//                           member.status === 'active' 
//                             ? 'bg-primary' 
//                             : member.status === 'suspended'
//                             ? 'bg-yellow-400'
//                             : 'bg-gray-400'
//                         }`}></div>
//                         {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
//                       </span>
//                     )
//                   },
//                   { 
//                     key: "joinDate", 
//                     label: "Join Date",
//                     render: (member) => (
//                       <span className="text-sm text-gray-500">
//                         {formatDate(member.joinDate)}
//                       </span>
//                     )
//                   }
//                 ]}
//                 data={paginatedData}
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={(page) => setCurrentPage(page)}
//                 actions={[
//                   {
//                     label: "View Details",
//                     type: "custom",
//                     icon: <Eye className="h-4 w-4" />,
//                     className: "text-blue-600 hover:text-blue-800",
//                     onClick: (row) => console.log(`Viewing details for ${row.name}`)
//                   },
//                   {
//                     label: "Edit",
//                     type: "custom",
//                     icon: <Edit className="h-4 w-4" />,
//                     className: "text-primary hover:text-green-800",
//                     onClick: (row) => console.log(`Editing ${row.name}`)
//                   },
//                   {
//                     label: "Message",
//                     type: "custom",
//                     icon: <Mail className="h-4 w-4" />,
//                     className: "text-gray-600 hover:text-gray-800",
//                     onClick: (row) => console.log(`Messaging ${row.name}`)
//                   },
//                   {
//                     label: "Remove",
//                     type: "custom",
//                     icon: <Trash2 className="h-4 w-4" />,
//                     className: "text-red-600 hover:text-red-800",
//                     onClick: (row) => console.log(`Removing ${row.name}`)
//                   }
//                 ]}
//               />
//             </div>
//           )}
//         </div>
        
//         {/* Add Member Modal */}
//         <Modal 
//           isOpen={isAddModalOpen} 
//           onClose={() => setIsAddModalOpen(false)} 
//           title="Add New Team Member"
//         >
//           <AuthForm
//             fields={addMemberFields}
//             validationSchema={addMemberSchema}
//             onSubmit={handleAddMemberSubmit}
//             buttonText="Create Member"
//             loading={submitLoading}
//           />
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default TeamPage;

import React from 'react'

const TeamPage = () => {
  return (
    <div>TeamPage</div>
  )
}

export default TeamPage