import { ApproveLeaveDTO } from "../../dto/leave/ApproveLeaveDTO";



export interface IApproveLeaveUseCase{
    execute(leaveDTO:ApproveLeaveDTO):Promise<string>
}