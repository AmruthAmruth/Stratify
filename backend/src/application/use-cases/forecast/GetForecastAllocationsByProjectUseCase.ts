import { IForecastAllocationRepository } from "../../../domain/repositories/IForecastAllocationRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { ForecastAllocationResponseDTO } from "../../dto/forecast/ForecastAllocationResponseDTO";
import { IGetForecastAllocationsByProjectUseCase } from "../../interfaces/forecast/IGetForecastAllocationsByProjectUseCase";

export class GetForecastAllocationsByProjectUseCase
    implements IGetForecastAllocationsByProjectUseCase {
    constructor(
        private _forecastRepo: IForecastAllocationRepository,
        private _employeeRepo: IEmployeeRepository,
        private _projectRepo: IProjectRepository,
    ) { }

    async execute(projectId: string): Promise<ForecastAllocationResponseDTO[]> {
        
        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        
        const forecasts = await this._forecastRepo.findByProjectId(projectId);

        
        const enrichedForecasts = await Promise.all(
            forecasts.map(async (forecast) => {
                const employee = await this._employeeRepo.findById(forecast.employeeId);

                
                const weeksInPeriod = forecast.endDate
                    ? Math.ceil(
                        (forecast.endDate.getTime() - forecast.startDate.getTime()) /
                        (1000 * 60 * 60 * 24 * 7),
                    )
                    : null;
                const totalForecastHours = weeksInPeriod
                    ? weeksInPeriod * forecast.forecastHoursPerWeek
                    : null;

                return {
                    id: forecast.id!,
                    employeeId: forecast.employeeId,
                    employeeName: employee?.name,
                    employeePosition: employee?.position,
                    projectId: forecast.projectId,
                    projectName: project.name,
                    projectKey: project.key,
                    forecastHoursPerWeek: forecast.forecastHoursPerWeek,
                    startDate: forecast.startDate,
                    endDate: forecast.endDate,
                    status: forecast.status,
                    notes: forecast.notes,
                    totalForecastHours: totalForecastHours ?? undefined,
                    weeksInPeriod: weeksInPeriod ?? undefined,
                    createdBy: forecast.createdBy,
                    createdByModel: forecast.createdByModel,
                    companyId: forecast.companyId,
                    createdAt: forecast.createdAt!,
                    updatedAt: forecast.updatedAt!,
                };
            }),
        );

        return enrichedForecasts;
    }
}
