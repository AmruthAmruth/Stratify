import { Employee } from "../../../domain/entities/employee";


 
export interface IGetAllEmployeeByCompanyIdUseCase{
    execute(id:string):Promise<Employee[]>
}