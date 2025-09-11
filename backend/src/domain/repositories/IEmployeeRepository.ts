import { Employee } from "../entities/Employee";




export interface IEmployeeRepository{
     create(employee:Employee):Promise<Employee>
     findByEmail(email:string):Promise<Employee|null>
     findByPhone(phone:string):Promise<Employee|null>
     updatePassword(email:string,password:string):Promise<void>
     totalEmployeeInADepartment(departmentId:string):Promise<number>
     findByDepartmentId(departmentId:string):Promise<Employee[]>
     totalEmployeeInACompany(companyId:string):Promise<number>
     findByCompanyId(companyId:string):Promise<Employee[]>
}