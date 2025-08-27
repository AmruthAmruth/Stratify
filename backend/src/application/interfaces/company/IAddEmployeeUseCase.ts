import { EmployeeDTO } from "../../dto/company/AddEmployeeDTO";



export interface IAddEmployeeUseCase {
  execute(data:EmployeeDTO): Promise<Date>;
}