import { GetMemberForEmployee } from "../../dto/chat/GetMemberForEmployeeDTO";


export interface IGetmemberForEmployeeUseCase{
    execute(employeeId:string):Promise<GetMemberForEmployee>
};