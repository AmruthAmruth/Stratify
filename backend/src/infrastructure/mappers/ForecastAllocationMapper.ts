import { ForecastAllocation } from "../../domain/entities/ForecastAllocation";
import { IForecastAllocationDocument } from "../models/ForecastAllocationModel";
import { Types } from "mongoose";

export class ForecastAllocationMapper {
    static toEntity(doc: IForecastAllocationDocument): ForecastAllocation {
        return new ForecastAllocation(
            (doc._id as Types.ObjectId).toString(),
            doc.employeeId.toString(),
            doc.projectId.toString(),
            doc.forecastHoursPerWeek,
            doc.startDate,
            doc.endDate,
            doc.status,
            doc.notes,
            doc.createdBy.toString(),
            doc.createdByModel,
            doc.companyId.toString(),
            doc.createdAt,
            doc.updatedAt,
        );
    }

    static toDocument(entity: ForecastAllocation): Partial<IForecastAllocationDocument> {
        return {
            employeeId: new Types.ObjectId(entity.employeeId) as unknown as Types.ObjectId,
            projectId: new Types.ObjectId(entity.projectId) as unknown as Types.ObjectId,
            forecastHoursPerWeek: entity.forecastHoursPerWeek,
            startDate: entity.startDate,
            endDate: entity.endDate,
            status: entity.status,
            notes: entity.notes,
            createdBy: new Types.ObjectId(entity.createdBy) as unknown as Types.ObjectId,
            createdByModel: entity.createdByModel,
            companyId: new Types.ObjectId(entity.companyId) as unknown as Types.ObjectId,
        };
    }

    static toEntities(docs: IForecastAllocationDocument[]): ForecastAllocation[] {
        return docs.map((doc) => ForecastAllocationMapper.toEntity(doc));
    }
}
