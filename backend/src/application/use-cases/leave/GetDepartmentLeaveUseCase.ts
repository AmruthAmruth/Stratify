import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { DepartmentLeaveDTO, LeaveDTO, LeaveCountsDTO } from "../../dto/leave/GetDepartmentLeaveDTO";
import { IGetDepartmentLeaveUseCase } from "../../interfaces/leave/IGetDepartmentLeavsUseCase";

export class GetDepartmentLeaveUseCase implements IGetDepartmentLeaveUseCase {
  constructor(
    private _leaveRepo: ILeaveRepository,
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(managerId: string): Promise<DepartmentLeaveDTO> {
    
    const manager = await this._managerRepo.findById(managerId);
    if (!manager) {
      throw new AppError("Manager not found", StatusCodes.NOT_FOUND);
    }

    const departmentId = manager.departmentId;
    if (!departmentId) {
      throw new AppError(
        "Manager does not belong to any department",
        StatusCodes.NOT_FOUND
      );
    }

 
    const leaves = await this._leaveRepo.findLeavesByDepartment(departmentId);

    
    const leaveCounts: LeaveCountsDTO = {
      totalLeave: leaves.length,
      peadingLeave: leaves.filter((l) => l.status === "Pending").length,
      approvedLeave: leaves.filter((l) => l.status === "Approved").length,
      activeMembers: new Set(leaves.map((l) => l.employeeId)).size,
    };

    const leavesDTO: LeaveDTO[] = await Promise.all(
      leaves.map(async (l) => {
        const employee = await this._employeeRepo.findById(l.employeeId);
        const employeeName = employee ? employee.name : "Unknown";
        return {
          employeeName,
          startDate: l.startDate,
          endDate: l.endDate,
          type: l.type,
          status: l.status,
          reason: l.reason,
        };
      })
    );

    return {
      leaveCounts,
      leaves: leavesDTO,
    };
  }
}
