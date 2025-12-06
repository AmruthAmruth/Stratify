import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { CompanyAnalyticsDTO } from "../../dto/company/CompanyAnalyticsDTO";
import { IGetCompanyAnalyticsUseCase } from "../../interfaces/company/IGetCompanyAnalyticsUseCase";

export class GetCompanyAnalyticsUseCase implements IGetCompanyAnalyticsUseCase {
    constructor(
        private _departmentRepo: IDepartmentRepository,
        private _employeeRepo: IEmployeeRepository,
        private _managerRepo: IManagerRepository,
        private _projectRepo: IProjectRepository,
        private _leaveRepo: ILeaveRepository,
        private _meetingRepo: IMeetingRepository,
    ) { }

    async execute(companyId: string): Promise<CompanyAnalyticsDTO> {
        if (!companyId) {
            throw new AppError("Company ID is required", StatusCodes.FORBIDDEN);
        }

        try {
            // Fetch all data in parallel
            const [departments, employees, managers, projects] = await Promise.all([
                this._departmentRepo.findDepartmentsByCompanyId(companyId),
                this._employeeRepo.findByCompanyId(companyId),
                this._managerRepo.findByCompanyId(companyId),
                this._projectRepo.findByCompanyId(companyId),
            ]);

            // Fetch leaves for all departments
            const currentMonth = new Date().getMonth() + 1;
            const leavePromises = departments
                .filter((dept) => dept.id !== undefined)
                .map((dept) =>
                    this._leaveRepo.findLeavesByDepartment(dept.id!, currentMonth)
                );
            const leavesArrays = await Promise.all(leavePromises);
            const allLeaves = leavesArrays.flat();

            // Fetch meetings for all managers
            const meetingPromises = managers
                .filter((manager) => manager.id !== undefined)
                .map((manager) =>
                    this._meetingRepo.findMeetingByCreatorId(manager.id!)
                );
            const meetingsArrays = await Promise.all(meetingPromises);
            const allMeetings = meetingsArrays.flat();

            // Calculate Statistics
            const totalEmployees = employees.length;
            const totalManagers = managers.length;
            const activeDepartments = departments.filter(
                (dept) => dept.managerId
            ).length;

            const activeProjects = projects.filter((p) => {
                const status = (p.status || "").toLowerCase();
                return (
                    status === "active" ||
                    status === "in-progress" ||
                    status === "in progress"
                );
            }).length;

            const completedProjects = projects.filter(
                (p) => (p.status || "").toLowerCase() === "completed"
            ).length;

            const pendingLeaves = allLeaves.filter(
                (leave) => leave.status === "Pending"
            ).length;

            const totalMeetings = allMeetings.length;

            // Prepare Chart Data

            // 1. Department Distribution (Doughnut) - Employees per department
            const departmentEmployeeCounts: { [key: string]: number } = {};
            for (const dept of departments) {
                const deptEmployees = employees.filter(
                    (emp) => emp.departmentId === dept.id
                );
                if (deptEmployees.length > 0) {
                    departmentEmployeeCounts[dept.name] = deptEmployees.length;
                }
            }

            // 2. Project Status (Pie)
            const projectStatusCounts = {
                Active: projects.filter((p) => {
                    const status = (p.status || "").toLowerCase();
                    return (
                        status === "active" ||
                        status === "in-progress" ||
                        status === "in progress"
                    );
                }).length,
                Completed: projects.filter(
                    (p) => (p.status || "").toLowerCase() === "completed"
                ).length,
                Planned: projects.filter((p) => {
                    const status = (p.status || "").toLowerCase();
                    return (
                        status === "pending" ||
                        status === "planning" ||
                        status === "planned"
                    );
                }).length,
                "On-Hold": projects.filter(
                    (p) => (p.status || "").toLowerCase() === "on-hold"
                ).length,
            };

            // 3. Employee by Department (Bar)
            const employeeByDepartment: { [key: string]: number } = {};
            for (const dept of departments) {
                const deptEmployees = employees.filter(
                    (emp) => emp.departmentId === dept.id
                );
                employeeByDepartment[dept.name] = deptEmployees.length;
            }

            // 4. Leave Status (Pie)
            const leaveStatusCounts = {
                Pending: allLeaves.filter((l) => l.status === "Pending").length,
                Approved: allLeaves.filter((l) => l.status === "Approved").length,
                Rejected: allLeaves.filter((l) => l.status === "Rejected").length,
            };

            // 5. Meeting Types (Bar)
            const meetingTypeCounts = {
                "Daily Standup": allMeetings.filter(
                    (m) =>
                        m.title?.toLowerCase().includes("daily") ||
                        m.title?.toLowerCase().includes("standup")
                ).length,
                Planning: allMeetings.filter((m) =>
                    m.title?.toLowerCase().includes("planning")
                ).length,
                Review: allMeetings.filter((m) =>
                    m.title?.toLowerCase().includes("review")
                ).length,
                Retrospective: allMeetings.filter((m) =>
                    m.title?.toLowerCase().includes("retro")
                ).length,
                Other: allMeetings.filter((m) => {
                    const title = m.title?.toLowerCase() || "";
                    return (
                        !title.includes("daily") &&
                        !title.includes("standup") &&
                        !title.includes("planning") &&
                        !title.includes("review") &&
                        !title.includes("retro")
                    );
                }).length,
            };

            // 6. Company Activity Timeline (Line) - Last 6 months
            const currentDate = new Date();
            const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            const last6Months = [];
            const activityCounts = [];

            for (let i = 5; i >= 0; i--) {
                const date = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - i,
                    1
                );
                last6Months.push(monthNames[date.getMonth()]);

                // Count projects created in this month
                const monthProjects = projects.filter((p) => {
                    if (!p.createdAt && !p.startDate) return false;
                    const projectDate = new Date(p.createdAt || p.startDate!);
                    return (
                        projectDate.getMonth() === date.getMonth() &&
                        projectDate.getFullYear() === date.getFullYear()
                    );
                }).length;

                // Count meetings in this month
                const monthMeetings = allMeetings.filter((m) => {
                    if (!m.createdAt) return false;
                    const meetingDate = new Date(m.createdAt);
                    return (
                        meetingDate.getMonth() === date.getMonth() &&
                        meetingDate.getFullYear() === date.getFullYear()
                    );
                }).length;

                // Combined activity score
                activityCounts.push(monthProjects * 3 + monthMeetings);
            }

            // Build response
            const analytics: CompanyAnalyticsDTO = {
                stats: {
                    totalEmployees,
                    totalManagers,
                    activeDepartments,
                    activeProjects,
                    completedProjects,
                    pendingLeaves,
                    totalMeetings,
                },
                chartData: {
                    departmentDistribution: {
                        labels: Object.keys(departmentEmployeeCounts),
                        data: Object.values(departmentEmployeeCounts),
                    },
                    projectStatus: {
                        labels: Object.keys(projectStatusCounts),
                        data: Object.values(projectStatusCounts),
                    },
                    employeeByDepartment: {
                        labels: Object.keys(employeeByDepartment),
                        data: Object.values(employeeByDepartment),
                    },
                    leaveStatus: {
                        labels: Object.keys(leaveStatusCounts),
                        data: Object.values(leaveStatusCounts),
                    },
                    meetingTypes: {
                        labels: Object.keys(meetingTypeCounts),
                        data: Object.values(meetingTypeCounts),
                    },
                    companyActivity: {
                        labels: last6Months,
                        data: activityCounts,
                    },
                },
            };

            return analytics;
        } catch (error) {
            console.error("Error fetching company analytics:", error);
            throw new AppError(
                "Failed to fetch company analytics",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}
