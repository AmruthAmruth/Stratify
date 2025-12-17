import { ForecastAllocation } from "../../../domain/entities/ForecastAllocation";
import { IForecastAllocationRepository } from "../../../domain/repositories/IForecastAllocationRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { UpdateForecastAllocationDTO } from "../../dto/forecast/UpdateForecastAllocationDTO";
import { ForecastAllocationResponseDTO } from "../../dto/forecast/ForecastAllocationResponseDTO";
import { IUpdateForecastAllocationUseCase } from "../../interfaces/forecast/IUpdateForecastAllocationUseCase";

export class UpdateForecastAllocationUseCase
    implements IUpdateForecastAllocationUseCase {
    constructor(
        private _forecastRepo: IForecastAllocationRepository,
        private _employeeRepo: IEmployeeRepository,
        private _projectRepo: IProjectRepository,
    ) { }

    async execute(
        id: string,
        data: UpdateForecastAllocationDTO,
    ): Promise<ForecastAllocationResponseDTO> {
        // Find existing forecast
        const existing = await this._forecastRepo.findById(id);
        if (!existing) {
            throw new AppError(
                "Forecast allocation not found",
                StatusCodes.NOT_FOUND,
            );
        }

        // Validate hours if provided
        if (
            data.forecastHoursPerWeek !== undefined &&
            (data.forecastHoursPerWeek <= 0 || data.forecastHoursPerWeek > 168)
        ) {
            throw new AppError(
                "Forecast hours per week must be between 1 and 168",
                StatusCodes.BAD_REQUEST,
            );
        }

        // Parse dates if provided
        const startDate = data.startDate
            ? new Date(data.startDate)
            : existing.startDate;
        const endDate = data.endDate
            ? data.endDate === null
                ? null
                : new Date(data.endDate)
            : existing.endDate;

        // Validate date range
        if (endDate && endDate <= startDate) {
            throw new AppError(
                "End date must be after start date",
                StatusCodes.BAD_REQUEST,
            );
        }

        // Update forecast
        const updated = new ForecastAllocation(
            existing.id,
            existing.employeeId,
            existing.projectId,
            data.forecastHoursPerWeek ?? existing.forecastHoursPerWeek,
            startDate,
            endDate,
            data.status ?? existing.status,
            data.notes !== undefined ? data.notes : existing.notes,
            existing.createdBy,
            existing.createdByModel,
            existing.companyId,
            existing.createdAt,
        );

        const result = await this._forecastRepo.update(updated);

        // Get employee and project details
        const employee = await this._employeeRepo.findById(result.employeeId);
        const project = await this._projectRepo.findById(result.projectId);

        // Calculate total forecast hours and weeks
        const weeksInPeriod = result.endDate
            ? Math.ceil(
                (result.endDate.getTime() - result.startDate.getTime()) /
                (1000 * 60 * 60 * 24 * 7),
            )
            : null;
        const totalForecastHours = weeksInPeriod
            ? weeksInPeriod * result.forecastHoursPerWeek
            : null;

        return {
            id: result.id!,
            employeeId: result.employeeId,
            employeeName: employee?.name,
            employeePosition: employee?.position,
            projectId: result.projectId,
            projectName: project?.name,
            projectKey: project?.key,
            forecastHoursPerWeek: result.forecastHoursPerWeek,
            startDate: result.startDate,
            endDate: result.endDate,
            status: result.status,
            notes: result.notes,
            totalForecastHours: totalForecastHours ?? undefined,
            weeksInPeriod: weeksInPeriod ?? undefined,
            createdBy: result.createdBy,
            createdByModel: result.createdByModel,
            companyId: result.companyId,
            createdAt: result.createdAt!,
            updatedAt: result.updatedAt!,
        };
    }
}
