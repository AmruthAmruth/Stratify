import { Employee } from "../../../domain/entities/Employee";


 
export interface IGetAllEmployeeByCompanyIdUseCase{
    execute(id:string):Promise<Employee[]>
}