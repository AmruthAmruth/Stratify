import { Types } from "mongoose";
import { ForecastAllocation } from "../../domain/entities/ForecastAllocation";
import { IForecastAllocationRepository } from "../../domain/repositories/IForecastAllocationRepository";
import {
    ForecastAllocationModel,
    IForecastAllocationDocument,
} from "../models/ForecastAllocationModel";
import { ForecastAllocationMapper } from "../mappers/ForecastAllocationMapper";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { BaseRepository } from "./BaseRepository"; 
 
export class ForecastAllocationRepository 
    extends BaseRepository<ForecastAllocation, IForecastAllocationDocument>
    implements IForecastAllocationRepository {
    constructor() {
        super(ForecastAllocationModel, ForecastAllocationMapper);
    }

    async findByEmployeeId(employeeId: string): Promise<ForecastAllocation[]> {
        const docs = await ForecastAllocationModel.find({
            employeeId: new Types.ObjectId(employeeId),
        })
            .sort({ startDate: -1 })
            .exec();

        return ForecastAllocationMapper.toEntities(docs);
    }

    async findByProjectId(projectId: string): Promise<ForecastAllocation[]> {
        const docs = await ForecastAllocationModel.find({
            projectId: new Types.ObjectId(projectId),
            status: "Active",
        })
            .sort({ startDate: -1 })
            .exec();

        return ForecastAllocationMapper.toEntities(docs);
    }

    async findByEmployeeAndProject(
        employeeId: string,
        projectId: string,
    ): Promise<ForecastAllocation[]> {
        const docs = await ForecastAllocationModel.find({
            employeeId: new Types.ObjectId(employeeId),
            projectId: new Types.ObjectId(projectId),
        })
            .sort({ startDate: -1 })
            .exec();

        return ForecastAllocationMapper.toEntities(docs);
    }

    async findActiveByEmployeeInRange(
        employeeId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<ForecastAllocation[]> {
        const docs = await ForecastAllocationModel.find({
            employeeId: new Types.ObjectId(employeeId),
            status: "Active",
            $or: [
                // Forecast starts within range
                { startDate: { $gte: startDate, $lte: endDate } },
                // Forecast ends within range
                { endDate: { $gte: startDate, $lte: endDate } },
                // Forecast spans the entire range
                { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
                // Ongoing forecast (no end date) that started before range end
                { startDate: { $lte: endDate }, endDate: null },
            ],
        })
            .sort({ startDate: 1 })
            .exec();

        return ForecastAllocationMapper.toEntities(docs);
    }

    async delete(id: string): Promise<void> {
        const result = await ForecastAllocationModel.findByIdAndDelete(
            new Types.ObjectId(id),
        ).exec();

        if (!result) {
            throw new AppError(
                "Forecast allocation not found",
                StatusCodes.NOT_FOUND,
            );
        }
    }
}
