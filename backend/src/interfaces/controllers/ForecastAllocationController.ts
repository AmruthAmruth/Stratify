import { Request, Response } from "express";
import { ICreateForecastAllocationUseCase } from "../../application/interfaces/forecast/ICreateForecastAllocationUseCase";
import { IUpdateForecastAllocationUseCase } from "../../application/interfaces/forecast/IUpdateForecastAllocationUseCase";
import { IGetForecastAllocationsByProjectUseCase } from "../../application/interfaces/forecast/IGetForecastAllocationsByProjectUseCase";
import { ICalculateForecastVsActualUseCase } from "../../application/interfaces/forecast/ICalculateForecastVsActualUseCase";
import { IForecastAllocationRepository } from "../../domain/repositories/IForecastAllocationRepository";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";

interface AuthenticatedRequest extends Request {
    userId: string;
    role: string;
    companyId: string;
}

export class ForecastAllocationController {
    constructor(
        private _createUseCase: ICreateForecastAllocationUseCase,
        private _updateUseCase: IUpdateForecastAllocationUseCase,
        private _getByProjectUseCase: IGetForecastAllocationsByProjectUseCase,
        private _calculateVsActualUseCase: ICalculateForecastVsActualUseCase,
        private _forecastRepo: IForecastAllocationRepository,
    ) { }

    // Create forecast allocation
    async create(req: Request, res: Response): Promise<void> {
        const { userId, role, companyId } = req as AuthenticatedRequest;

        const createdByModel = role === "company" ? "Company" : "Manager";

        const result = await this._createUseCase.execute(
            req.body,
            userId,
            createdByModel as "Company" | "Manager",
            companyId,
        );

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: Messages.FORECAST_CREATED,
            data: result,
        });
    }

    // Update forecast allocation
    async update(req: Request, res: Response): Promise<void> {
        const id = req.params.id as string;

        const result = await this._updateUseCase.execute(id, req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: Messages.FORECAST_UPDATED,
            data: result,
        });
    }

    // Get forecast allocations by project
    async getByProject(req: Request, res: Response): Promise<void> {
        const projectId = req.params.projectId as string;

        const result = await this._getByProjectUseCase.execute(projectId as string);

        res.status(StatusCodes.OK).json({
            success: true,
            message: Messages.FORECAST_RETRIEVED,
            data: result,
        });
    }

    // Get forecast allocations by employee
    async getByEmployee(req: Request, res: Response): Promise<void> {
        const employeeId = req.params.employeeId as string;

        const result = await this._forecastRepo.findByEmployeeId(employeeId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: Messages.FORECAST_RETRIEVED,
            data: result,
        });
    }

    // Get forecast allocation by ID
    async getById(req: Request, res: Response): Promise<void> {
        const id = req.params.id as string;

        const result = await this._forecastRepo.findById(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: Messages.FORECAST_RETRIEVED,
            data: result,
        });
    }

    // Calculate forecast vs actual
    async calculateVsActual(req: Request, res: Response): Promise<void> {
        const employeeId = req.params.employeeId as string;
        const projectId = req.params.projectId as string;
        const { startDate, endDate } = req.query;

        const result = await this._calculateVsActualUseCase.execute(
            employeeId as string,
            projectId as string,
            startDate as string | undefined,
            endDate as string | undefined,
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: Messages.FORECAST_CALCULATED,
            data: result,
        });
    }

    // Delete forecast allocation
    async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id as string;

        await this._forecastRepo.delete(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: Messages.FORECAST_DELETED,
            data: { deleted: true },
        });
    }
}
