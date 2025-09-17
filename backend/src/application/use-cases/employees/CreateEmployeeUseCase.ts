import { Company } from "../../../domain/entities/Company";
import { Employee } from "../../../domain/entities/Employee";
import { Manager } from "../../../domain/entities/Manager";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { Messages } from "../../../shared/constants/messages";
import { generateRandomPassword, hashPassword } from "../../../shared/utils/password";
import { CreateEmployeeDTO } from "../../dto/employees/CreateEmployeeDTO";
import { ICreateEmployeeUseCase } from "../../interfaces/employees/ICreateEmployeeUseCase";
import { employeeWelcomeTemplate } from "../../templates/EmployeeWelcomeTemplate";

export class CreateEmployeeUseCase implements ICreateEmployeeUseCase {
  constructor(
    private _companyRepo: ICompanyRepository,
    private _employeeRepo: IEmployeeRepository,
    private _departmentRepo: IDepartmentRepository,
    private _managerRepo: IManagerRepository,
    private _emailService: IEmailService
  ) {}

  async execute(employeeDto: CreateEmployeeDTO, creatorId: string): Promise<Employee> {
   
    let creator: Company | Manager | null = await this._companyRepo.findById(creatorId);
    let companyId: string;

    if (creator) {
      companyId = creator.id!;
    } else {
      creator = await this._managerRepo.findById(creatorId);
      if (!creator) throw new Error("Invalid creator ID");
      companyId = creator.companyId;
    }

   
    const company = await this._companyRepo.findById(companyId);
    if (!company) throw new Error(Messages.COMPANY_NOT_FOUND);

  
    const existingEmployee = await this._employeeRepo.findByEmail(employeeDto.email);
    if (existingEmployee) throw new Error(Messages.EMAIL_ALREADY_EXISTS);

   
    const department = await this._departmentRepo.findById(employeeDto.departmentId);
    if (!department || department.companyId !== companyId) {
      throw new Error("Department not found");
    }

   
    if (creator instanceof Manager && creator.departmentId !== employeeDto.departmentId) {
      throw new Error("Manager can only add employees in their own department");
    }

   
    const tempPassword = await generateRandomPassword();
    const hashedPassword = await hashPassword(tempPassword);
  const managerIdToAssign = department.managerId ? department.managerId.toString() : undefined;

    
    const employee = new Employee(
      undefined,
      employeeDto.name,
      employeeDto.email,
      employeeDto.phone,
      employeeDto.dob,
      employeeDto.joiningDate,
      employeeDto.position,
      hashedPassword,
      companyId, 
      employeeDto.departmentId,
      employeeDto.gender,
      "employee",
       employeeDto.managerId || managerIdToAssign,
      employeeDto.profileImage,
    );

    const createdEmployee = await this._employeeRepo.create(employee);



const html = employeeWelcomeTemplate(
  createdEmployee.name,
  company.name,
  department.name,
  createdEmployee.position,
  tempPassword
);

    await this._emailService.sendEmail(
      createdEmployee.email,
      `👋 Welcome to ${company.name}!`,
      html
    );

    return createdEmployee;
  }
}
