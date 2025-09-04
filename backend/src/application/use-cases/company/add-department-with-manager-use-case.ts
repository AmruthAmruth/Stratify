import { ICompanyRepository } from "../../../domain/repositories/i-company-repository";
import { IDepartmentRepo } from "../../../domain/repositories/i-department-repository";
import { IManagerRepo } from "../../../domain/repositories/i-manager-repository";
import { EmailService } from "../../../infrastructure/services/email-service";
import { Messages } from "../../../shared/constants/messages";
import { generateRandomPassword, hashPassword } from "../../../shared/utils/password";
import { AddDepartmentWithManagerDTO } from "../../dto/company/add-department-with-manager-dto";
import { AddDepartmentWithManagerResponse } from "../../dto/company/add-department-with-manager-response-dto";

export class AddDepartmentWithManagerUseCase {
  constructor(
    private _departmentRepo: IDepartmentRepo,
    private _managerRepo: IManagerRepo,
    private _companyRepo: ICompanyRepository,
    private _emailService: EmailService
  ) {}

  async execute(data:AddDepartmentWithManagerDTO): Promise<AddDepartmentWithManagerResponse> {
    const company = await this._companyRepo.findById(data.companyId);
    if (!company) throw new Error(Messages.COMPANY_NOT_FOUND);

    const existingManager = await this._managerRepo.findByEmail(data.managerEmail);
    if (existingManager) throw new Error(Messages.MANAGER_ALREADY_EXISTS);



    const department = await this._departmentRepo.create({
      name: data.departmentName,
      companyId: data.companyId,
      description:data.departmentDescription
    });

    const tempPassword = generateRandomPassword();
console.log("Manager Temp Password :",tempPassword)
    const hashedPassword = await hashPassword(tempPassword);
    
    const manager = await this._managerRepo.create({
      name: data.managerName,
      email: data.managerEmail,
      phone: data.managerPhone,
      password: hashedPassword,
      companyId: data.companyId,
      departmentId: department.id,
      role: "manager",
      status: "active",
    });

    department.managerId = manager.id;
    await this._departmentRepo.update(department);

    await this._emailService.sendEmail( 
      data.managerEmail,
      "Your Account Created",
      `Email: ${data.managerEmail}\nPassword: ${tempPassword}\nPlease login and change your password.`
    );
    

   return {
  department: {
    id: department.id,
    name: department.name,
    companyId: department.companyId,
    managerId: department.managerId,
    discription:department.description,
  },
  manager: {
    id: manager.id,
    name: manager.name,
    email: manager.email,
    phone: manager.phone,
    companyId: manager.companyId,
    departmentId: manager.departmentId,
    role: manager.role,
    status: manager.status,
  },
};
  }
}
