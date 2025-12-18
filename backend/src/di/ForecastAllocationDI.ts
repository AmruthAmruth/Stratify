import { ForecastAllocationRepository } from "../infrastructure/repositories/ForecastAllocationRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { LeaveRepository } from "../infrastructure/repositories/LeaveRepository";
import { IssueRepository } from "../infrastructure/repositories/IssueRepository";
import { CreateForecastAllocationUseCase } from "../application/use-cases/forecast/CreateForecastAllocationUseCase";
import { UpdateForecastAllocationUseCase } from "../application/use-cases/forecast/UpdateForecastAllocationUseCase";
import { GetForecastAllocationsByProjectUseCase } from "../application/use-cases/forecast/GetForecastAllocationsByProjectUseCase";
import { CalculateForecastVsActualUseCase } from "../application/use-cases/forecast/CalculateForecastVsActualUseCase";
import { ForecastAllocationController } from "../interfaces/controllers/ForecastAllocationController";

export class ForecastAllocationDI {
    private static forecastRepo = new ForecastAllocationRepository();
    private static employeeRepo = new EmployeeRepository();
    private static projectRepo = new ProjectRepository();
    private static leaveRepo = new LeaveRepository();
    private static issueRepo = new IssueRepository();

    // Use Cases
    private static createUseCase = new CreateForecastAllocationUseCase(
        ForecastAllocationDI.forecastRepo,
        ForecastAllocationDI.employeeRepo,
        ForecastAllocationDI.projectRepo,
    );

    private static updateUseCase = new UpdateForecastAllocationUseCase(
        ForecastAllocationDI.forecastRepo,
        ForecastAllocationDI.employeeRepo,
        ForecastAllocationDI.projectRepo,
    );

    private static getByProjectUseCase =
        new GetForecastAllocationsByProjectUseCase(
            ForecastAllocationDI.forecastRepo,
            ForecastAllocationDI.employeeRepo,
            ForecastAllocationDI.projectRepo,
        );

    private static calculateVsActualUseCase =
        new CalculateForecastVsActualUseCase(
            ForecastAllocationDI.forecastRepo,
            ForecastAllocationDI.employeeRepo,
            ForecastAllocationDI.projectRepo,
            ForecastAllocationDI.leaveRepo,
            ForecastAllocationDI.issueRepo,
        );

    // Controller
    private static controller = new ForecastAllocationController(
        ForecastAllocationDI.createUseCase,
        ForecastAllocationDI.updateUseCase,
        ForecastAllocationDI.getByProjectUseCase,
        ForecastAllocationDI.calculateVsActualUseCase,
        ForecastAllocationDI.forecastRepo,
    );

    static getForecastAllocationController(): ForecastAllocationController {
        return ForecastAllocationDI.controller;
    }
}
