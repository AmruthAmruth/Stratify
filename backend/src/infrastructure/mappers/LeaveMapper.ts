import { Leave } from "../../domain/entities/Leave";
import { LeaveDocument } from "../models/LeaveModel";
import { Types } from "mongoose";

export class LeaveMapper {
  static toEntity(doc: LeaveDocument): Leave {
    return new Leave(
      doc.id.toString(),
      doc.employeeId.toString(),
      doc.startDate,
      doc.endDate,
      doc.type,
      doc.status,
      doc.reason,
      doc.createdAt,
      doc.updatedAt,
      doc.month,
      doc.departmentId.toString(),
      doc.companyId.toString(),
      doc.rejectedReason,
    );
  }

  static toDocument(entity: Leave): Partial<LeaveDocument> {
    return {
      employeeId: new Types.ObjectId(entity.employeeId),
      startDate: entity.startDate,
      endDate: entity.endDate,
      type: entity.type,
      status: entity.status,
      reason: entity.reason,
      month: entity.month,
      departmentId: new Types.ObjectId(entity.departmentId),
      companyId: new Types.ObjectId(entity.companyId),
      rejectedReason: entity.rejectedReason,
    };
  }

  static toEntities(docs: LeaveDocument[]): Leave[] {
    return docs.map(this.toEntity);
  }
}
