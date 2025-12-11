import { LeaveImpactDTO } from "../../dto/leave/LeaveImpactDTO";

export interface IAnalyzeLeaveImpactUseCase {
    execute(employeeId: string, startDate: Date, endDate: Date): Promise<LeaveImpactDTO>;
}
