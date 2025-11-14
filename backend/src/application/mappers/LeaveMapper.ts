import { Leave } from "../../domain/entities/Leave";
import { Employee } from "../../domain/entities/Employee";
import { CreateLeaveDTO } from "../dto/leave/CreateLeaveDTO";

export class LeaveMapper {
  
  static toDomain(
    dto: CreateLeaveDTO,
    employee: Employee,
    start: Date,
    end: Date,
    leaveMonth: number,
    LeaveType: "Casual" | "Sick" | "Earned" | "Other"
  ): Leave {
    return new Leave(
      undefined,
      dto.employeeId,
      start,
      end,
      LeaveType,
      "Pending",
      dto.reason,
      new Date(),
      new Date(),
      leaveMonth,
      employee.departmentId,
      employee.companyId,
    );
  }
}