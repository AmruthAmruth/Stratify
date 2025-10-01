import { IEmailService } from "../../../domain/repositories/IEmailService";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { ApproveLeaveDTO } from "../../dto/leave/ApproveLeaveDTO";
import { IApproveLeaveUseCase } from "../../interfaces/leave/IApproveLeaveUseCase";
import { leaveStatusTemplate } from "../../templates/leaveStatusTemplate";

export class ApproveLeaveUseCase implements IApproveLeaveUseCase {
    constructor(
        private _leaveRepo: ILeaveRepository,
        private _employeeRepo: IEmployeeRepository,
        private _emailService: IEmailService
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

        if (leave.status !== "Pending") {
            throw new AppError(
                "Only pending leaves can be approved or rejected",
                StatusCodes.BAD_REQUEST
            );
        }

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

    
        await this._emailService.sendEmail(
            employee.email,
            `Your leave has been ${status}`,
            html
        );

      
        return `Leave has been ${status.toLowerCase()} successfully${status === "Rejected" ? ` with reason: ${reason}` : ""}.`;
    }
}
