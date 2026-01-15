import React, { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import ReusableChart from '@/shared/components/Chart/ReusableChart';
import Table from '@/shared/components/Table/Table';
import Modal from '@/shared/components/ModalFrom/ModalForm';
import AuthForm from '@/shared/components/Forms/DynamicForm';
import { addMember } from '@/shared/components/Forms/formFields';
import { addMemberSchema } from '@/shared/utils/validations';
import { getDepartmentEmployees, getTeamAnalytics, Employee, TeamAnalytics } from '@/services/team';
import { createEmployee } from '@/services/company';
import { getManagerProfile } from '@/services/authApi';
import { Users, UserCheck, TrendingUp, Briefcase } from 'lucide-react';

const SNACKBAR_OPTIONS = {
    autoHideDuration: 3000,
    anchorOrigin: { vertical: 'top' as const, horizontal: 'right' as const },
};

const MyTeam = () => {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [departmentId, setDepartmentId] = useState<string>("");
    const itemsPerPage = 6;

    useEffect(() => {
        fetchTeamData();
        fetchManagerDepartment();
    }, []);

    const fetchTeamData = async () => {
        try {
            setLoading(true);
            const [employeesData, analyticsData] = await Promise.all([
                getDepartmentEmployees(),
                getTeamAnalytics(),
            ]);
            setEmployees(employeesData);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Error fetching team data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchManagerDepartment = async () => {
        try {
            const profile = await getManagerProfile();

            // Extract departmentId from various possible formats
            let deptId: string | undefined;

            if (typeof profile.departmentId === 'string') {
                deptId = profile.departmentId;
            } else if (profile.departmentId && typeof profile.departmentId === 'object') {
                // Handle both _id and id properties
                const deptObj = profile.departmentId as Record<string, unknown>;
                deptId = (deptObj._id as string) || (deptObj.id as string);
            }

            if (deptId) {
                setDepartmentId(deptId);
            } else {
                console.warn('⚠️ Manager profile does not have department information');
            }
        } catch (error) {
            console.error('Error fetching manager profile:', error);
        }
    };

    const openEmployeeModal = () => {
        setIsEmployeeModalOpen(true);
    };

    const closeEmployeeModal = () => {
        setIsEmployeeModalOpen(false);
    };

    const handleCreateEmployee = async (formValues: Record<string, unknown>) => {
        if (!departmentId) {
            enqueueSnackbar("Unable to create employee: Department information is missing. Please contact your administrator.", {
                variant: "error",
                ...SNACKBAR_OPTIONS,
            });
            console.error("❌ departmentId is missing when attempting to create employee:", departmentId);
            return;
        }

        setSubmitLoading(true);
        try {
            await createEmployee({ ...formValues, departmentId });

            enqueueSnackbar("Employee created successfully!", {
                variant: "success",
                ...SNACKBAR_OPTIONS,
            });

            await fetchTeamData();
            closeEmployeeModal();
        } catch (err: unknown) {
            enqueueSnackbar((err as Error)?.message || "Failed to create employee.", {
                variant: "error",
                ...SNACKBAR_OPTIONS,
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-text font-medium">Loading Team Data...</p>
                </div>
            </div>
        );
    }

    // Pagination
    const totalPages = Math.ceil(employees.length / itemsPerPage);
    const paginatedEmployees = employees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Table columns
    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'position', label: 'Position' },
        { key: 'joiningDate', label: 'Joining Date' },
        { key: 'gender', label: 'Gender' },
    ];

    // Custom cell renderer
    const renderCell = (employee: Employee, key: string) => {
        if (key === 'name') {
            return (
                <div className="flex items-center gap-3">
                    {employee.profileImage ? (
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${employee.profileImage}`}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                            {employee.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="font-medium text-text">{employee.name}</span>
                </div>
            );
        }
        if (key === 'joiningDate') {
            return new Date(employee.joiningDate).toLocaleDateString();
        }
        if (key === 'gender') {
            return (
                <span className="capitalize px-3 py-1 rounded-full text-xs font-medium bg-accent text-text">
                    {employee.gender}
                </span>
            );
        }
        return employee[key as keyof Employee];
    };

    return (
        <div className="min-h-screen bg-bg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-text mb-2 flex items-center gap-3">
                        <Users className="w-10 h-10 text-primary" />
                        My Team
                    </h1>
                    <p className="text-text/70">Manage and monitor your department's team members</p>
                </div>

                {/* Add Employee Button */}
                <button
                    onClick={openEmployeeModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitLoading}
                >
                    + Add Employee
                </button>
            </div>

            {/* Dashboard Cards */}
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <DashboardCard
                        title="Total Team Members"
                        value={analytics.totalEmployees}
                        subtitle="All employees in department"
                        trend="none"
                        badge={`${analytics.activeEmployees} Active`}
                    />
                    <DashboardCard
                        title="Active Employees"
                        value={analytics.activeEmployees}
                        subtitle="Working on active projects"
                        trend="up"
                        badge={`${Math.round((analytics.activeEmployees / (analytics.totalEmployees || 1)) * 100)}%`}
                    />
                    <DashboardCard
                        title="Employees on Leave"
                        value={analytics.employeesOnLeave}
                        subtitle="Currently on approved leave"
                        trend={analytics.employeesOnLeave > 0 ? "down" : "none"}
                    />
                    <DashboardCard
                        title="Average Experience"
                        value={`${analytics.averageExperience} yrs`}
                        subtitle="Team average tenure"
                        trend="up"
                    />
                    <DashboardCard
                        title="Project Allocation"
                        value={analytics.projectAllocation.assigned}
                        subtitle="Employees assigned to projects"
                        badge={`${analytics.projectAllocation.unassigned} Unassigned`}
                    />
                    <DashboardCard
                        title="Team Utilization"
                        value={`${Math.round((analytics.projectAllocation.assigned / (analytics.totalEmployees || 1)) * 100)}%`}
                        subtitle="Overall team allocation"
                        trend={analytics.projectAllocation.assigned > analytics.projectAllocation.unassigned ? "up" : "down"}
                    />
                </div>
            )}

            {/* Analytics Charts */}
            {analytics && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-text mb-6">Team Analytics</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Position Distribution Chart */}
                        <div className="bg-surface border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                Position Distribution
                            </h3>
                            {Object.keys(analytics.positionDistribution).length > 0 ? (
                                <div className="h-64 flex items-center justify-center">
                                    <ReusableChart
                                        type="doughnut"
                                        labels={Object.keys(analytics.positionDistribution)}
                                        data={Object.values(analytics.positionDistribution)}
                                        backgroundColors={['#009063', '#3b3b3b', '#dfdcef', '#6c5ce7', '#a29bfe', '#74b9ff']}
                                    />
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-text/50">
                                    <p>No position data available</p>
                                </div>
                            )}
                        </div>

                        {/* Project Allocation Chart */}
                        <div className="bg-surface border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Project Allocation
                            </h3>
                            <div className="h-64">
                                <ReusableChart
                                    type="bar"
                                    labels={['Assigned', 'Unassigned']}
                                    data={[analytics.projectAllocation.assigned, analytics.projectAllocation.unassigned]}
                                    backgroundColors={['#009063', '#dfdcef']}
                                />
                            </div>
                        </div>

                        {/* Gender Diversity Chart */}
                        <div className="bg-surface border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Gender Diversity
                            </h3>
                            <div className="h-64 flex items-center justify-center">
                                <ReusableChart
                                    type="pie"
                                    labels={['Male', 'Female', 'Other']}
                                    data={[
                                        analytics.genderDistribution.male,
                                        analytics.genderDistribution.female,
                                        analytics.genderDistribution.other,
                                    ]}
                                    backgroundColors={['#009063', '#6c5ce7', '#ffd93d']}
                                />
                            </div>
                        </div>

                        {/* Team Status Overview */}
                        <div className="bg-surface border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-primary" />
                                Team Status Overview
                            </h3>
                            <div className="h-64">
                                <ReusableChart
                                    type="bar"
                                    labels={['Active', 'On Leave', 'Unassigned']}
                                    data={[
                                        analytics.activeEmployees,
                                        analytics.employeesOnLeave,
                                        analytics.projectAllocation.unassigned,
                                    ]}
                                    backgroundColors={['#009063', '#ff6b6b', '#dfdcef']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Table */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-6">Team Members</h2>
                <Table
                    columns={columns}
                    data={paginatedEmployees}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    renderCell={renderCell}
                />
            </div>

            {/* Create Employee Modal */}
            {isEmployeeModalOpen && (
                <Modal
                    isOpen={isEmployeeModalOpen}
                    onClose={closeEmployeeModal}
                    title="Add New Employee"
                >
                    <div className="space-y-4">
                        <div className="shadow-lg rounded-xl p-8 max-w-4xl mx-auto bg-surface">
                            <AuthForm
                                fields={addMember}
                                validationSchema={addMemberSchema}
                                onSubmit={handleCreateEmployee}
                                buttonText="Create Employee"
                                disabled={submitLoading}
                            />
                        </div>

                        {submitLoading && (
                            <div className="flex justify-center mt-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MyTeam;
