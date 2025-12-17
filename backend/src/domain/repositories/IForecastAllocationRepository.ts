import { ForecastAllocation } from "../entities/ForecastAllocation";

export interface IForecastAllocationRepository {
    create(forecast: ForecastAllocation): Promise<ForecastAllocation>;
    update(forecast: ForecastAllocation): Promise<ForecastAllocation>;
    findById(id: string): Promise<ForecastAllocation | null>;
    findByEmployeeId(employeeId: string): Promise<ForecastAllocation[]>;
    findByProjectId(projectId: string): Promise<ForecastAllocation[]>;
    findByEmployeeAndProject(
        employeeId: string,
        projectId: string,
    ): Promise<ForecastAllocation[]>;
    findActiveByEmployeeInRange(
        employeeId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<ForecastAllocation[]>;
    delete(id: string): Promise<void>;
}
