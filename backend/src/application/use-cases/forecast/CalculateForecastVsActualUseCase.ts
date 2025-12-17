import { IForecastAllocationRepository } from "../../../domain/repositories/IForecastAllocationRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { ForecastVsActualDTO } from "../../dto/forecast/ForecastVsActualDTO";
import { ICalculateForecastVsActualUseCase } from "../../interfaces/forecast/ICalculateForecastVsActualUseCase";
import { DateUtils } from "../../../shared/utils/DateUtils";

export class CalculateForecastVsActualUseCase
    implements ICalculateForecastVsActualUseCase {
    constructor(
        private _forecastRepo: IForecastAllocationRepository,
        private _employeeRepo: IEmployeeRepository,
        private _projectRepo: IProjectRepository,
        private _leaveRepo: ILeaveRepository,
        private _issueRepo: IIssueRepository,
    ) { }

    async execute(
        employeeId: string,
        projectId: string,
        startDate?: string,
        endDate?: string,
    ): Promise<ForecastVsActualDTO> {
        // Validate employee exists
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) {
            throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // Validate project exists
        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // Get forecast allocations for employee and project
        const forecasts = await this._forecastRepo.findByEmployeeAndProject(
            employeeId,
            projectId,
        );

        if (forecasts.length === 0) {
            throw new AppError(
                "No forecast allocation found for this employee on this project",
                StatusCodes.NOT_FOUND,
            );
        }

        // Determine date range
        let rangeStart: Date;
        let rangeEnd: Date;

        if (startDate && endDate) {
            rangeStart = new Date(startDate);
            rangeEnd = new Date(endDate);
        } else {
            // Use the earliest start and latest end from active forecasts
            const activeForecasts = forecasts.filter((f) => f.status === "Active");
            if (activeForecasts.length === 0) {
                throw new AppError(
                    "No active forecast allocation found",
                    StatusCodes.NOT_FOUND,
                );
            }

            rangeStart = new Date(
                Math.min(...activeForecasts.map((f) => f.startDate.getTime())),
            );
            rangeEnd = activeForecasts.some((f) => !f.endDate)
                ? new Date() // Use current date for ongoing forecasts
                : new Date(
                    Math.max(
                        ...activeForecasts
                            .filter((f) => f.endDate)
                            .map((f) => f.endDate!.getTime()),
                    ),
                );
        }

        // Calculate total forecast hours
        let totalForecastHours = 0;
        for (const forecast of forecasts.filter((f) => f.status === "Active")) {
            const forecastStart = forecast.startDate > rangeStart ? forecast.startDate : rangeStart;
            const forecastEnd = forecast.endDate && forecast.endDate < rangeEnd ? forecast.endDate : rangeEnd;

            const weeks = Math.ceil(
                (forecastEnd.getTime() - forecastStart.getTime()) /
                (1000 * 60 * 60 * 24 * 7),
            );
            totalForecastHours += weeks * forecast.forecastHoursPerWeek;
        }

        // Get actual hours from issues assigned to this employee in this project
        const allIssues = await this._issueRepo.findByProjectId(projectId);
        const issues = allIssues.filter(
            (issue) => issue.assignedTo === employeeId,
        );

        // Filter issues within date range and sum estimated hours (using size as proxy)
        const actualHours = issues
            .filter((issue) => {
                if (!issue.createdAt) return false;
                return issue.createdAt >= rangeStart && issue.createdAt <= rangeEnd;
            })
            .reduce((sum: number, issue) => sum + (issue.size || 0), 0);

        // Get approved leaves in the date range
        const leaves = await this._leaveRepo.findApprovedLeavesByEmployeesInRange(
            [employeeId],
            rangeStart,
            rangeEnd,
        );

        // Calculate leave hours
        const leaveDays = DateUtils.countLeaveDays(
            leaves.map((leave) => ({
                startDate: leave.startDate,
                endDate: leave.endDate,
            })),
            rangeStart,
            rangeEnd,
        );
        const leaveHours = leaveDays * 8; // Assuming 8 hours per day

        // Calculate available hours (forecast minus leaves)
        const availableHours = totalForecastHours - leaveHours;

        // Calculate variance
        const variance = actualHours - totalForecastHours;
        const variancePercent =
            totalForecastHours > 0 ? (variance / totalForecastHours) * 100 : 0;

        // Calculate utilization (actual vs available)
        const utilizationPercent =
            availableHours > 0 ? (actualHours / availableHours) * 100 : 0;

        return {
            employeeId: employee.id!,
            employeeName: employee.name,
            projectId: project.id!,
            projectName: project.name,
            forecastHours: Math.round(totalForecastHours * 100) / 100,
            actualHours: Math.round(actualHours * 100) / 100,
            variance: Math.round(variance * 100) / 100,
            variancePercent: Math.round(variancePercent * 100) / 100,
            leaveHours: Math.round(leaveHours * 100) / 100,
            availableHours: Math.round(availableHours * 100) / 100,
            utilizationPercent: Math.round(utilizationPercent * 100) / 100,
            period: {
                startDate: rangeStart,
                endDate: rangeEnd,
            },
        };
    }
}
