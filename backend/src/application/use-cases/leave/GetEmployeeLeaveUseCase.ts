import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { LEAVE_POLICY } from "../../../shared/constants/leavePolicy";
import {
  EmployeeLeaveDTO,
  LeaveCountsDTO,
  LeaveDTO,
} from "../../dto/leave/GetEmployeeLeaveDTO";
import { IGetEmployeeLeaveUseCase } from "../../interfaces/leave/IGetEmployeeLeaveUseCase";

export class GetEmployeeLeaveUseCase implements IGetEmployeeLeaveUseCase {
  constructor(private _leaveRepo: ILeaveRepository) {}

  async execute(employeeId: string): Promise<EmployeeLeaveDTO> {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const leaves = await this._leaveRepo.findLeavesByEmployeeAndMonth(
      employeeId,
      currentMonth,
    );

    const leaveCounts: LeaveCountsDTO = {
      Casual: LEAVE_POLICY.Casual?.monthlyQuota ?? 0,
      Sick: LEAVE_POLICY.Sick?.monthlyQuota ?? 0,
      Earned: LEAVE_POLICY.Earned?.monthlyQuota ?? 0,
    };

    for (const leave of leaves) {
      if (leave.status === "Approved") {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);

        const clampedStart =
          start.getFullYear() === currentYear &&
          start.getMonth() + 1 === currentMonth
            ? start
            : new Date(currentYear, currentMonth - 1, 1);
        const clampedEnd =
          end.getFullYear() === currentYear &&
          end.getMonth() + 1 === currentMonth
            ? end
            : new Date(currentYear, currentMonth, 0);

        const diffDays =
          Math.ceil(
            (clampedEnd.getTime() - clampedStart.getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1;

        if (
          leave.type === "Casual" ||
          leave.type === "Sick" ||
          leave.type === "Earned"
        ) {
          leaveCounts[leave.type] = Math.max(
            leaveCounts[leave.type] - diffDays,
            0,
          );
        }
      }
    }

    const leaveDTOs: LeaveDTO[] = leaves.map((l) => ({
      employeeId: l.employeeId,
      startDate: l.startDate,
      endDate: l.endDate,
      type: l.type,
      status: l.status,
      reason: l.reason,
    }));

    return {
      leaveCounts,
      leaves: leaveDTOs,
    };
  }
}
