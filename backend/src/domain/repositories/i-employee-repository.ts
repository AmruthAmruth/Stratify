import { Employee } from "../entities/employee";




export interface IEmployeeRepository{
     create(employee:Employee):Promise<Employee>
     findByEmail(email:string):Promise<Employee|null>
     findByPhone(phone:string):Promise<Employee|null>
}