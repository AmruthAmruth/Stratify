import { Types } from "mongoose";
import { Leave } from "../../domain/entities/Leave";
import { ILeaveRepository } from "../../domain/repositories/ILeaveRepository";
import { LeaveModel } from "../models/LeaveModel";
import { LeaveMapper } from "../mappers/LeaveMapper";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";

export class LeaveRepository implements ILeaveRepository {
  async create(leave: Leave): Promise<Leave> {
    const created = await new LeaveModel({
      employeeId: new Types.ObjectId(leave.employeeId),
      startDate: leave.startDate,
      endDate: leave.endDate,
      type: leave.type ?? "Casual",
      status: leave.status ?? "Pending",
      reason: leave.reason,
      rejectedReason: leave.rejectedReason,
      month: leave.startDate.getMonth(),
      departmentId: new Types.ObjectId(leave.departmentId),
      companyId: new Types.ObjectId(leave.companyId),
    }).save();

    return LeaveMapper.toEntity(created);
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
        rejectedReason: leave.rejectedReason,
        month: leave.startDate.getMonth(),
        departmentId: new Types.ObjectId(leave.departmentId),
        companyId: new Types.ObjectId(leave.companyId),
      },
      { new: true },
    ).exec();

    if (!updated) throw new AppError(Messages.LEAVE_NOT_FOUND, StatusCodes.NOT_FOUND);

    return LeaveMapper.toEntity(updated);
  }

  async findById(id: string): Promise<Leave | null> {
    const doc = await LeaveModel.findById(new Types.ObjectId(id)).exec();
    if (!doc) return null;

    return LeaveMapper.toEntity(doc);
  }

  async findOverlappingLeave(
    employeeId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Leave | null> {
    const overlapping = await LeaveModel.findOne({
      employeeId: new Types.ObjectId(employeeId),
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    }).exec();

    if (!overlapping) return null;

    return LeaveMapper.toEntity(overlapping);
  }

  async countLeaveDays(
    employeeId: string,
    start: Date,
    end: Date,
    leaveType: string,
  ): Promise<number> {
    const leaves = await LeaveModel.find({
      employeeId: new Types.ObjectId(employeeId),
      type: leaveType,
      status: { $in: ["Approved", "Pending"] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    }).exec();

    let totalDays = 0;
    for (const leave of leaves) {
      const leaveStart = leave.startDate < start ? start : leave.startDate;
      const leaveEnd = leave.endDate > end ? end : leave.endDate;
      totalDays +=
        Math.ceil(
          (leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1;
    }
    return totalDays;
  }

  async countLeaveDaysByMonth(
    employeeId: string,
    month: number,
    type: string,
  ): Promise<number> {
    const leaves = await LeaveModel.find({
      employeeId: new Types.ObjectId(employeeId),
      month,
      type,
      status: { $in: ["Approved"] },
    }).exec();

    return leaves.reduce((sum, leave) => {
      const start = leave.startDate;
      const end = leave.endDate;
      return (
        sum +
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1
      );
    }, 0);
  }

  async getLeavesByEmployeeAndDateRange(
    startOfMonth: Date,
    endOfMonth: Date,
  ): Promise<Leave[]> {
    const docs = await LeaveModel.find({
      startDate: { $lte: endOfMonth },
      endDate: { $gte: startOfMonth },
    })
      .sort({ startDate: 1 })
      .exec();

    return LeaveMapper.toEntities(docs);
  }

  async findLeavesByEmployeeAndMonth(
    employeeId: string,
    month: number,
  ): Promise<Leave[]> {
    const docs = await LeaveModel.find({
      employeeId: new Types.ObjectId(employeeId),
      month,
    })
      .sort({ startDate: 1 })
      .exec();

    return LeaveMapper.toEntities(docs);
  }

  async findLeavesByDepartment(
    departmentId: string,
    currentMonth: number,
  ): Promise<Leave[]> {
    const docs = await LeaveModel.find({
      departmentId: new Types.ObjectId(departmentId),
      month: currentMonth,
    })
      .sort({ startDate: 1 })
      .exec();

    return LeaveMapper.toEntities(docs);
  }

  async findLeavesByDepartmentAndDateRange(
    departmentId: string,
    start: Date,
    end: Date,
  ): Promise<Leave[]> {
    const docs = await LeaveModel.find({
      departmentId: new Types.ObjectId(departmentId),
      $or: [
        { startDate: { $lte: end, $gte: start } },
        { endDate: { $gte: start, $lte: end } },
        { startDate: { $lte: start }, endDate: { $gte: end } },
      ],
    })
      .sort({ startDate: 1 })
      .exec();

    return LeaveMapper.toEntities(docs);
  }
  async findApprovedLeavesByEmployeesInRange(
    employeeIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Leave[]> {
    const docs = await LeaveModel.find({
      employeeId: { $in: employeeIds.map((id) => new Types.ObjectId(id)) },
      status: "Approved",
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    }).exec();

    return LeaveMapper.toEntities(docs);
  }


async findLeaveOfEmployee(employeeId:string,startDate:Date,endDate:Date):Promise<boolean>{
  const leave = await LeaveModel.find({employeeId,$or:[{startDate:{$gte:startDate},endDate:{$lte:endDate}}]})
    if(leave){
      return true
    }else{
      return false;
    }
}




}
