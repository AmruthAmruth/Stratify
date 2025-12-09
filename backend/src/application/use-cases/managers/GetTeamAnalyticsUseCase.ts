import { IGetTeamAnalyticsUseCase, TeamAnalytics } from "../../interfaces/managers/IGetTeamAnalyticsUseCase";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class GetTeamAnalyticsUseCase implements IGetTeamAnalyticsUseCase {
    constructor(
        private managerRepository: IManagerRepository,
        private employeeRepository: IEmployeeRepository,
        private projectRepository: IProjectRepository,
        private leaveRepository: ILeaveRepository
    ) { }

    async execute(managerId: string): Promise<TeamAnalytics> {

        const manager = await this.managerRepository.findById(managerId);

        if (!manager) {
            throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        if (!manager.departmentId) {
            throw new AppError(Messages.MANAGER_NO_DEPARTMENT, StatusCodes.BAD_REQUEST);
        }


        const employees = await this.employeeRepository.findByDepartmentId(manager.departmentId);


        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);


        const leaves = await this.leaveRepository.findLeavesByDepartmentAndDateRange(
            manager.departmentId,
            startOfMonth,
            endOfMonth
        );


        const totalEmployees = employees.length;


        const employeesOnLeave = leaves.filter(leave => {
            return leave.status === 'Approved' &&
                new Date(leave.startDate) <= now &&
                new Date(leave.endDate) >= now;
        }).length;


        let totalExperience = 0;
        employees.forEach(emp => {
            const joiningDate = new Date(emp.joiningDate);
            const yearsOfExperience = (now.getTime() - joiningDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
            totalExperience += yearsOfExperience;
        });
        const averageExperience = totalEmployees > 0 ? Math.round((totalExperience / totalEmployees) * 10) / 10 : 0;


        const positionDistribution: { [position: string]: number } = {};
        employees.forEach(emp => {
            const position = emp.position || 'Unknown';
            positionDistribution[position] = (positionDistribution[position] || 0) + 1;
        });


        const genderDistribution = {
            male: employees.filter(emp => emp.gender === 'male').length,
            female: employees.filter(emp => emp.gender === 'female').length,
            other: employees.filter(emp => emp.gender === 'other').length,
        };

        const employeeIdsInProjects = new Set<string>();
        const activeProjectEmployees = new Set<string>();


        for (const employee of employees) {
            const employeeProjects = await this.projectRepository.findByTeamMemberId(employee.id!);

            if (employeeProjects.length > 0) {
                employeeIdsInProjects.add(employee.id!);


                const hasActiveProject = employeeProjects.some(p => {
                    const status = (p.status || '').toLowerCase();
                    return status === 'active';
                });

                if (hasActiveProject) {
                    activeProjectEmployees.add(employee.id!);
                }
            }
        }

        const assigned = employeeIdsInProjects.size;
        const unassigned = totalEmployees - assigned;
        const activeEmployees = activeProjectEmployees.size;

        return {
            totalEmployees,
            activeEmployees,
            employeesOnLeave,
            averageExperience,
            positionDistribution,
            genderDistribution,
            projectAllocation: {
                assigned,
                unassigned,
            },
        };
    }
}
