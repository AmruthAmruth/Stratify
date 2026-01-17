import { ForecastAllocation } from "../../../domain/entities/ForecastAllocation";
import { IForecastAllocationRepository } from "../../../domain/repositories/IForecastAllocationRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { CreateForecastAllocationDTO } from "../../dto/forecast/CreateForecastAllocationDTO";
import { ForecastAllocationResponseDTO } from "../../dto/forecast/ForecastAllocationResponseDTO";
import { ICreateForecastAllocationUseCase } from "../../interfaces/forecast/ICreateForecastAllocationUseCase";

export class CreateForecastAllocationUseCase
    implements ICreateForecastAllocationUseCase {
    constructor(
        private _forecastRepo: IForecastAllocationRepository,
        private _employeeRepo: IEmployeeRepository,
        private _projectRepo: IProjectRepository,
    ) { }

    async execute(
        data: CreateForecastAllocationDTO,
        createdBy: string,
        createdByModel: "Company" | "Manager",
        companyId: string,
    ): Promise<ForecastAllocationResponseDTO> {
        // Validate employee exists and belongs to company
        const employee = await this._employeeRepo.findById(data.employeeId);
        if (!employee) {
            throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
        }
        if (employee.companyId !== companyId) {
            throw new AppError(
                "Employee does not belong to your company",
                StatusCodes.FORBIDDEN,
            );
        }

        // Validate project exists and belongs to company
        const project = await this._projectRepo.findById(data.projectId);
        if (!project) {
            throw new AppError("Project not found", StatusCodes.NOT_FOUND);
        }
        if (project.companyId !== companyId) {
            throw new AppError(
                "Project does not belong to your company",
                StatusCodes.FORBIDDEN,
            );
        }

        // Validate hours per week
        if (data.forecastHoursPerWeek <= 0 || data.forecastHoursPerWeek > 168) {
            throw new AppError(
                "Forecast hours per week must be between 1 and 168",
                StatusCodes.BAD_REQUEST,
            );
        }

        // Parse dates
        const startDate = new Date(data.startDate);
        const endDate = data.endDate ? new Date(data.endDate) : null;

        // Validate date range
        if (endDate && endDate <= startDate) {
            throw new AppError(
                "End date must be after start date",
                StatusCodes.BAD_REQUEST,
            );
        }

        // Create forecast allocation
        const forecast = new ForecastAllocation(
            undefined,
            data.employeeId,
            data.projectId,
            data.forecastHoursPerWeek,
            startDate,
            endDate,
            "Active",
            data.notes,
            createdBy,
            createdByModel,
            companyId,
        );

        const created = await this._forecastRepo.create(forecast);

        // Calculate total forecast hours and weeks
        const weeksInPeriod = endDate
            ? Math.ceil(
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
            )
            : null;
        const totalForecastHours = weeksInPeriod
            ? weeksInPeriod * data.forecastHoursPerWeek
            : null;

        // Return response DTO
        return {
            id: created.id!,
            employeeId: created.employeeId,
            employeeName: employee.name,
            employeePosition: employee.position,
            projectId: created.projectId,
            projectName: project.name,
            projectKey: project.key,
            forecastHoursPerWeek: created.forecastHoursPerWeek,
            startDate: created.startDate,
            endDate: created.endDate,
            status: created.status,
            notes: created.notes,
            totalForecastHours: totalForecastHours ?? undefined,
            weeksInPeriod: weeksInPeriod ?? undefined,
            createdBy: created.createdBy,
            createdByModel: created.createdByModel,
            companyId: created.companyId,
            createdAt: created.createdAt!,
            updatedAt: created.updatedAt!,
        };
    }
}
