import { EmployeeLeaveDTO } from "../../dto/leave/GetEmployeeLeaveDTO";


export interface IGetEmployeeLeaveUseCase{
    execute(employeeId:string):Promise<EmployeeLeaveDTO>
}