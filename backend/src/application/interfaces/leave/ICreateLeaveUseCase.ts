import { Leave } from "../../../domain/entities/Leave";
import { CreateLeaveDTO } from "../../dto/leave/CreateLeaveDTO";



export interface ICreateLeaveUseCase{
    execute(leave:CreateLeaveDTO):Promise<Leave>
}