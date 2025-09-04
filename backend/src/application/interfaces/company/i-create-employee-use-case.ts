import { Employee } from "../../../domain/entities/employee";





export interface ICreateEmployeeUseCase{
    execute(employee: {
    name: string;
    email: string;
    phone: string;
    dob: Date;
    joiningDate: Date;
    position: string;
    departmentId: string;
    status: "active" | "inactive" | "suspended";
  }):Promise<Employee>;

} 