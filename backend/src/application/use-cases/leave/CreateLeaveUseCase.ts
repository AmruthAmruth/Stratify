import { Leave } from "../../../domain/entities/Leave";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { CreateLeaveDTO } from "../../dto/leave/CreateLeaveDTO";
import { ICreateLeaveUseCase } from "../../interfaces/leave/ICreateLeaveUseCase";
import { LEAVE_POLICY } from "../../../shared/constants/leavePolicy";

export class CreateLeaveUseCase implements ICreateLeaveUseCase {
  constructor(
    private _leaveRepo: ILeaveRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(leaveDTO: CreateLeaveDTO): Promise<Leave> {
    // 1️⃣ Check if employee exists
    const employee = await this._employeeRepo.findById(leaveDTO.employeeId);
    if (!employee) {
      throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
    }

    // 2️⃣ Validate leave type and policy
    const leaveType = leaveDTO.type || "Casual";
    const policy = LEAVE_POLICY[leaveType];
    if (!policy) {
      throw new AppError(`Invalid leave type: ${leaveType}`, StatusCodes.BAD_REQUEST);
    }

    // 3️⃣ Check overlapping leaves
    const overlappingLeave = await this._leaveRepo.findOverlappingLeave(
      leaveDTO.employeeId,
      leaveDTO.startDate,
      leaveDTO.endDate
    );
    if (overlappingLeave) {
      throw new AppError("Leave overlaps with existing leave", StatusCodes.BAD_REQUEST);
    }

    // 4️⃣ Calculate number of leave days
    const start = new Date(leaveDTO.startDate);
    const end = new Date(leaveDTO.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // 5️⃣ Monthly quota check (UTC-safe)
    if (policy.monthlyQuota) {
      const monthStart = new Date(Date.UTC(start.getFullYear(), start.getMonth(), 1, 0, 0, 0));
      const monthEnd = new Date(Date.UTC(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59));

      const usedThisMonth = await this._leaveRepo.countLeaveDays(
        leaveDTO.employeeId,
        monthStart,
        monthEnd,
        leaveType
      );

      if (usedThisMonth + days > policy.monthlyQuota) {
        throw new AppError(
          `${leaveType} leave monthly quota exceeded`,
          StatusCodes.BAD_REQUEST
        );
      }
    }

    // 6️⃣ Annual quota check (UTC-safe)
    if (policy.annualQuota) {
      const yearStart = new Date(Date.UTC(start.getFullYear(), 0, 1, 0, 0, 0));
      const yearEnd = new Date(Date.UTC(start.getFullYear(), 11, 31, 23, 59, 59));

      const usedThisYear = await this._leaveRepo.countLeaveDays(
        leaveDTO.employeeId,
        yearStart,
        yearEnd,
        leaveType
      );

      if (usedThisYear + days > policy.annualQuota) {
        throw new AppError(
          `${leaveType} leave annual quota exceeded`,
          StatusCodes.BAD_REQUEST
        );
      }
    }

    // 7️⃣ Create the leave entity
    const leave = new Leave(
      undefined,
      leaveDTO.employeeId,
      start,
      end,
      leaveType,
      "Pending", // default status
      leaveDTO.reason,
      new Date(),
      new Date()
    );

    // 8️⃣ Save leave in repository
    return await this._leaveRepo.create(leave);
  }
}
