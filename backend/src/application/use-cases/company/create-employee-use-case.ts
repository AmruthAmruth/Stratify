import { Employee } from "../../../domain/entities/employee";
import { IDepartmentRepo } from "../../../domain/repositories/i-department-repository";
import { IEmailService } from "../../../domain/repositories/i-email-services";
import { IEmployeeRepository } from "../../../domain/repositories/i-employee-repository";
import { Messages } from "../../../shared/constants/messages";
import { generateRandomPassword, hashPassword } from "../../../shared/utils/password";



export class CreateEmployeeUseCase {
  constructor(
    private _employeeRepo: IEmployeeRepository,
    private _departmentRepo: IDepartmentRepo,
    private _emailService:IEmailService
  ) {}

  async execute(employee: {
    name: string;
    email: string;
    phone: string;
    dob: Date;
    joiningDate: Date;
    position: string;
    departmentId: string;
    status: "active" | "inactive" | "suspended";
  }): Promise<Employee> {
    const department = await this._departmentRepo.findById(employee.departmentId);
    if (!department) {
      throw new Error("Invalid Department");
    }

    

    const companyId = department.companyId;
    const managerId = department.managerId;

    const existingEmail = await this._employeeRepo.findByEmail(employee.email);
    if (existingEmail) {
      throw new Error(Messages.EMAIL_ALREADY_EXISTS);
    }

    const existingPhone = await this._employeeRepo.findByPhone(employee.phone);
    if (existingPhone) {
      throw new Error(Messages.PHONE_ALREADY_EXISTS);
    }

    const dob = new Date(employee.dob);
    const joiningDate = new Date(employee.joiningDate);


    const tempPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(tempPassword)
console.log("Temp Password ",tempPassword);

    const newEmployee = new Employee(
      "",
      employee.name,
      employee.email,
      employee.phone,
      dob,
      joiningDate,
      employee.position,
      managerId,
      undefined,
      employee.departmentId,
      companyId,
      hashedPassword,
      employee.status,
      "employee",
      new Date(),
      new Date()
    );

    const createdEmployee = await this._employeeRepo.create(newEmployee);

await this._emailService.sendEmail( 
      createdEmployee.email,
      "Your Account Created",
      `Email: ${createdEmployee.email}\nPassword: ${tempPassword}\nPlease login and change your password.`
    );


    return createdEmployee;
  }
}