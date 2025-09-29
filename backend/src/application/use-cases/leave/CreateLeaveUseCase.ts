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
    
    const employee = await this._employeeRepo.findById(leaveDTO.employeeId);
    if (!employee) throw new AppError("Employee not found", StatusCodes.NOT_FOUND);

   
    const leaveType = leaveDTO.type || "Casual";
    const policy = LEAVE_POLICY[leaveType];
    if (!policy) throw new AppError(`Invalid leave type: ${leaveType}`, StatusCodes.BAD_REQUEST);

    const overlappingLeave = await this._leaveRepo.findOverlappingLeave(
      leaveDTO.employeeId,
      leaveDTO.startDate,
      leaveDTO.endDate
    );
    if (overlappingLeave) {
      throw new AppError("Leave overlaps with existing leave", StatusCodes.BAD_REQUEST);
    }

   
    const start = new Date(leaveDTO.startDate);
    const end = new Date(leaveDTO.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

 
    if (policy.monthlyQuota) {
      const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);
      const monthEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);

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

    
    if (policy.annualQuota) {
      const yearStart = new Date(start.getFullYear(), 0, 1);
      const yearEnd = new Date(start.getFullYear(), 11, 31);

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

    const leave = new Leave(
      undefined,
      leaveDTO.employeeId,
      leaveDTO.startDate,
      leaveDTO.endDate,
      leaveType,
      "Pending", 
      leaveDTO.reason,
      new Date(),
      new Date()
    );

    return await this._leaveRepo.create(leave);
  }
}
