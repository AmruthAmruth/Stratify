import { IEmailService } from "../../../domain/repositories/IEmailService";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { ApproveLeaveDTO } from "../../dto/leave/ApproveLeaveDTO";
import { IApproveLeaveUseCase } from "../../interfaces/leave/IApproveLeaveUseCase";
import { leaveStatusTemplate } from "../../../shared/templates/leaveStatusTemplate";
import { Notification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { NotificationEmitter } from "../../../shared/events/NotificationEmitter";

export class ApproveLeaveUseCase implements IApproveLeaveUseCase {
  constructor(
    private _leaveRepo: ILeaveRepository,
    private _employeeRepo: IEmployeeRepository,
    private _emailService: IEmailService,
    private _notificationRepo: INotificationRepository
  ) {}

  async execute(leaveDTO: ApproveLeaveDTO): Promise<string> {
    const { leaveId, status, reason } = leaveDTO;

    if (status !== "Approved" && status !== "Rejected") {
      throw new AppError(
        "Invalid status. Must be 'Approved' or 'Rejected'.",
        StatusCodes.BAD_REQUEST
      );
    }

    const leave = await this._leaveRepo.findById(leaveId);
    if (!leave) {
      throw new AppError("Leave not found", StatusCodes.NOT_FOUND);
    }

    // if (leave.status !== "Pending") {
    //   throw new AppError(
    //     "Only pending leaves can be approved or rejected",
    //     StatusCodes.BAD_REQUEST
    //   );
    // }
    if (status === "Rejected" && (!reason || reason.trim() === "")) {
      throw new AppError(
        "Reason is required when rejecting a leave",
        StatusCodes.BAD_REQUEST
      );
    }

    leave.status = status;
    if (status === "Rejected") {
      leave.rejectedReason = reason;
    }

    await this._leaveRepo.update(leave);

    const employee = await this._employeeRepo.findById(leave.employeeId);
    if (!employee) {
      throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
    }

    const html = leaveStatusTemplate(
      employee.name,
      leave.startDate,
      leave.endDate,
      status,
      reason
    );

    const title = status === "Approved" ? "Leave Approved" : "Leave Rejected";

    const message =
      status === "Approved"
        ? `Your leave request from ${leave.startDate} to ${leave.endDate} has been approved.`
        : `Your leave request from ${leave.startDate} to ${leave.endDate} has been rejected. Reason: ${reason}`;

    const type = status === "Approved" ? "success" : "error";

    const notification = new Notification(
      employee.id!,
      employee.role,
      title,
      message,
      type
    );
 NotificationEmitter.emit(notification);
    await this._notificationRepo.create(notification);

    await this._emailService.sendEmail(
      employee.email,
      `Your leave has been ${status}`,
      html
    );

    return `Leave has been ${status.toLowerCase()} successfully${
      status === "Rejected" ? ` with reason: ${reason}` : ""
    }.`;
  }
}
