import { ILeaveRepository } from "../../../domain/repositories/ILeaveRepository";
import { EmployeeLeaveDTO, LeaveCountsDTO, LeaveDTO } from "../../dto/leave/GetEmployeeLeaveDTO";
import { IGetEmployeeLeaveUseCase } from "../../interfaces/leave/IGetEmployeeLeaveUseCase";




export class GetEmployeeLeaveUseCase implements IGetEmployeeLeaveUseCase{
    constructor(
            private _leaveRepo:ILeaveRepository
    ){}

    async execute(employeeId: string): Promise<EmployeeLeaveDTO> {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();


          const monthlyLeaves: LeaveDTO[] = await this._leaveRepo.getCurrentMonthLeavesByEmployeeId(
            employeeId,
            currentMonth,
            currentYear
        );


         const leaveCounts: LeaveCountsDTO = {
            Casual: 0,
            Sick: 0,
            Earned: 0,
        };


                monthlyLeaves.forEach((leave) => {
            if (leave.type === "Casual") leaveCounts.Casual += 1;
            else if (leave.type === "Sick") leaveCounts.Sick += 1;
            else if (leave.type === "Earned") leaveCounts.Earned += 1;
        });


          return {
            leaveCounts,
            leaves: monthlyLeaves,
        };

        



    }
}
