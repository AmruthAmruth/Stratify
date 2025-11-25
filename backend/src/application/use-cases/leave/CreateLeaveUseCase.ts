import { Leave } from "../../../domain/entities/Leave";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { CreateLeaveDTO } from "../../dto/leave/CreateLeaveDTO";
import { ICreateLeaveUseCase } from "../../interfaces/leave/ICreateLeaveUseCase";
import { LEAVE_POLICY } from "../../../shared/constants/leavePolicy";
import { LeaveMapper } from "../../mappers/LeaveMapper";
import { Notification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { NotificationEmitter } from "../../../shared/events/NotificationEmitter";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";

export class CreateLeaveUseCase implements ICreateLeaveUseCase {
  constructor(
    private _leaveRepo: ILeaveRepository,
    private _employeeRepo: IEmployeeRepository,
    private _notificationRepo: INotificationRepository,
    private _managerRepo: IManagerRepository
  ) { }

  async execute(leaveDTO: CreateLeaveDTO): Promise<Leave> {
    const employee = await this._employeeRepo.findById(leaveDTO.employeeId);
    if (!employee) {
      throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
    }

    const leaveType = leaveDTO.type || "Casual";
    const policy = LEAVE_POLICY[leaveType];
    if (!policy) {
      throw new AppError(
        `Invalid leave type: ${leaveType}`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const overlappingLeave = await this._leaveRepo.findOverlappingLeave(
      leaveDTO.employeeId,
      leaveDTO.startDate,
      leaveDTO.endDate,
    );
    if (overlappingLeave) {
      throw new AppError(
        "Leave overlaps with existing leave",
        StatusCodes.BAD_REQUEST,
      );
    }

    const start = new Date(leaveDTO.startDate);
    const end = new Date(leaveDTO.endDate);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leaveMonth = start.getMonth();

    if (policy.monthlyQuota) {
      const usedThisMonth = await this._leaveRepo.countLeaveDaysByMonth(
        leaveDTO.employeeId,
        leaveMonth,
        leaveType,
      );

      if (usedThisMonth + days > policy.monthlyQuota) {
        throw new AppError(
          `${leaveType} leave monthly quota exceeded`,
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    if (policy.annualQuota) {
      const yearStart = new Date(Date.UTC(start.getFullYear(), 0, 1, 0, 0, 0));
      const yearEnd = new Date(
        Date.UTC(start.getFullYear(), 11, 31, 23, 59, 59),
      );

      const usedThisYear = await this._leaveRepo.countLeaveDays(
        leaveDTO.employeeId,
        yearStart,
        yearEnd,
        leaveType,
      );

      if (usedThisYear + days > policy.annualQuota) {
        throw new AppError(
          `${leaveType} leave annual quota exceeded`,
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    const leave = LeaveMapper.toDomain(
      leaveDTO,
      employee,
      start,
      end,
      leaveMonth,
      leaveType
    );

    const createdLeave = await this._leaveRepo.create(leave);

    // Notify manager about new leave request
    if (employee.managerId) {
      const manager = await this._managerRepo.findById(employee.managerId);
      if (manager) {
        const notification = new Notification(
          manager.id!,
          manager.role,
          "New Leave Request",
          `📋 ${employee.name} has requested ${leaveType} leave from ${start.toLocaleDateString()} to ${end.toLocaleDateString()} (${days} days)`,
          "info"
        );
        NotificationEmitter.emit(notification);
        await this._notificationRepo.create(notification);
      }
    }

    return createdLeave;
  }
}