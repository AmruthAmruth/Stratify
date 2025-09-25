import { Types } from "mongoose";
import { Leave } from "../../domain/entities/Leave";
import { ILeaveRepository } from "../../domain/repositories/ILeaveRepository";
import { LeaveModel } from "../models/LeaveModel";

export class LeaveRepository implements ILeaveRepository {
  async create(leave: Leave): Promise<Leave> {
    const created = await new LeaveModel({
      employeeId: new Types.ObjectId(leave.employeeId),
      startDate: leave.startDate,
      endDate: leave.endDate,
      type: leave.type ?? "Casual",
      status: leave.status ?? "Pending",
      reason: leave.reason,
    }).save();

    return new Leave(
      created.id.toString(),
      created.employeeId.toString(),
      created.startDate,
      created.endDate,
      created.type,
      created.status,
      created.reason,
      created.createdAt,
      created.updatedAt
    );
  }

  async update(leave: Leave): Promise<Leave> {
    const updated = await LeaveModel.findByIdAndUpdate(
      new Types.ObjectId(leave.id),
      {
        startDate: leave.startDate,
        endDate: leave.endDate,
        type: leave.type,
        status: leave.status,
        reason: leave.reason,
      },
      { new: true }
    ).exec();

    if (!updated) throw new Error("Leave not found");

    return new Leave(
      updated.id.toString(),
      updated.employeeId.toString(),
      updated.startDate,
      updated.endDate,
      updated.type,
      updated.status,
      updated.reason,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async findById(id: string): Promise<Leave | null> {
    const doc = await LeaveModel.findById(new Types.ObjectId(id)).exec();
    if (!doc) return null;

    return new Leave(
      doc.id.toString(),
      doc.employeeId.toString(),
      doc.startDate,
      doc.endDate,
      doc.type,
      doc.status,
      doc.reason,
      doc.createdAt,
      doc.updatedAt
    );
  }


  async findOverlappingLeave(employeeId: string, startDate: Date, endDate: Date): Promise<Leave | null> {
    const overlapping = await LeaveModel.findOne({
    employeeId: new Types.ObjectId(employeeId),
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  }).exec();

  if (!overlapping) return null;

  return new Leave(
    overlapping.id.toString(),
    overlapping.employeeId.toString(),
    overlapping.startDate,
    overlapping.endDate,
    overlapping.type,
    overlapping.status,
    overlapping.reason,
    overlapping.createdAt,
    overlapping.updatedAt
  );
  }
}
