import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { EmployeeLeaveDTO, LeaveCountsDTO, LeaveDTO } from "../../dto/leave/GetEmployeeLeaveDTO";
import { IGetEmployeeLeaveUseCase } from "../../interfaces/leave/IGetEmployeeLeaveUseCase";

export class GetEmployeeLeaveUseCase implements IGetEmployeeLeaveUseCase {
    constructor(private _leaveRepo: ILeaveRepository) {}

    async execute(employeeId: string): Promise<EmployeeLeaveDTO> {
        console.log("Employee ID",employeeId);
        
         const now = new Date();
const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0));
const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59));


 const leaves = await this._leaveRepo.getLeavesByEmployeeAndDateRange(
            employeeId,
            startOfMonth,
            endOfMonth
        );


console.log("Leaves ",leaves);

         const leaveCounts: LeaveCountsDTO = {
            Casual: 2,
            Sick: 2,
            Earned: 1,
        };



        const leaveDTOs: LeaveDTO[] = leaves.map((leave) => ({
            employeeId: leave.employeeId.toString(),
            startDate: leave.startDate,
            endDate: leave.endDate,
            type: leave.type,
            status: leave.status,
            reason: leave.reason,
        }));

         for (const leave of leaveDTOs) {
            if (leave.status === "Approved") {
                if (leave.type in leaveCounts) {
                    // Calculate number of days in this leave
                    const days =
                        Math.ceil(
                            (leave.endDate.getTime() - leave.startDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                        ) + 1;

                    leaveCounts[leave.type as keyof LeaveCountsDTO] =
                        Math.max(0, leaveCounts[leave.type as keyof LeaveCountsDTO] - days);
                }
            }
        }


         return {
            leaveCounts,
            leaves: leaveDTOs,
        };

    }
}
