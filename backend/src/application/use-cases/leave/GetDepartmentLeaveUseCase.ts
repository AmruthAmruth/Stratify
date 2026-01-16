import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import {
  DepartmentLeaveDTO,
  LeaveDTO,
  LeaveCountsDTO,
} from "../../dto/leave/GetDepartmentLeaveDTO";
import { IGetDepartmentLeaveUseCase } from "../../interfaces/leave/IGetDepartmentLeavsUseCase";

export class GetDepartmentLeaveUseCase implements IGetDepartmentLeaveUseCase {
  constructor(
    private _leaveRepo: ILeaveRepository,
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository,
  ) { }

  async execute(managerId: string): Promise<DepartmentLeaveDTO> {
    const manager = await this._managerRepo.findByIdWithDepartment(managerId);
    if (!manager) {
      throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    // Handle populated departmentId (it's an object with _id and name when populated)
    const departmentId = manager.departmentId?._id?.toString();
    if (!departmentId) {
      throw new AppError(
        Messages.MANAGER_NO_DEPARTMENT,
        StatusCodes.NOT_FOUND,
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 1);

    const leaves = await this._leaveRepo.findLeavesByDepartmentAndDateRange(
      departmentId,
      today,
      farFuture,
    );

    const employeesInDept =
      await this._employeeRepo.findByDepartmentId(departmentId);
    const totalEmployees = employeesInDept.length;

    // Filter for employees currently on leave (today)
    const currentLeaves = leaves.filter(
      (l) =>
        l.status === "Approved" &&
        new Date(l.startDate) <= today &&
        new Date(l.endDate) >= today,
    );

    const leaveCounts: LeaveCountsDTO = {
      totalLeave: leaves.length,
      peadingLeave: leaves.filter((l) => l.status === "Pending").length,
      approvedLeave: leaves.filter((l) => l.status === "Approved").length,
      activeMembers:
        totalEmployees - new Set(currentLeaves.map((l) => l.employeeId)).size,
    };

    const leavesDTO: LeaveDTO[] = leaves.map((l) => {
      const employee = employeesInDept.find((e) => e.id === l.employeeId);
      const employeeName = employee ? employee.name : "Unknown";

      return {
        leaveId: l.id,
        employeeName,
        startDate: l.startDate,
        endDate: l.endDate,
        type: l.type,
        status: l.status,
        reason: l.reason,
        rejectedReason: l.rejectedReason,
      };
    });

    return {
      leaveCounts,
      leaves: leavesDTO,
    };
  }
}
