import { Leave } from "../../domain/entities/Leave";
import { LeaveDocument } from "../models/LeaveModel";

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

  static toEntities(docs: LeaveDocument[]): Leave[] {
    return docs.map(this.toEntity);
  }
}
