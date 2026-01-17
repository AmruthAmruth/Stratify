import { Request, Response } from "express";
import { ICreateForecastAllocationUseCase } from "../../application/interfaces/forecast/ICreateForecastAllocationUseCase";
import { IUpdateForecastAllocationUseCase } from "../../application/interfaces/forecast/IUpdateForecastAllocationUseCase";
import { IGetForecastAllocationsByProjectUseCase } from "../../application/interfaces/forecast/IGetForecastAllocationsByProjectUseCase";
import { ICalculateForecastVsActualUseCase } from "../../application/interfaces/forecast/ICalculateForecastVsActualUseCase";
import { IForecastAllocationRepository } from "../../domain/repositories/IForecastAllocationRepository";
import { StatusCodes } from "../../shared/constants/statusCodes";

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
            message: "Forecast allocation created successfully",
            data: result,
        });
    }

    
    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const result = await this._updateUseCase.execute(id, req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Forecast allocation updated successfully",
            data: result,
        });
    }

    
    async getByProject(req: Request, res: Response): Promise<void> {
        const { projectId } = req.params;

        const result = await this._getByProjectUseCase.execute(projectId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Forecast allocations retrieved successfully",
            data: result,
        });
    }

    
    async getByEmployee(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;

        const result = await this._forecastRepo.findByEmployeeId(employeeId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Forecast allocations retrieved successfully",
            data: result,
        });
    }

    
    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const result = await this._forecastRepo.findById(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Forecast allocation retrieved successfully",
            data: result,
        });
    }

    
    async calculateVsActual(req: Request, res: Response): Promise<void> {
        const { employeeId, projectId } = req.params;
        const { startDate, endDate } = req.query;

        const result = await this._calculateVsActualUseCase.execute(
            employeeId,
            projectId,
            startDate as string | undefined,
            endDate as string | undefined,
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Forecast vs actual calculated successfully",
            data: result,
        });
    }

    
    async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await this._forecastRepo.delete(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Forecast allocation deleted successfully",
            data: { deleted: true },
        });
    }
}
