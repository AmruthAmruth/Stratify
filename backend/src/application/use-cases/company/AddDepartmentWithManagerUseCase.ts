import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepo } from "../../../domain/repositories/IDepartmentRepository";
import { IManagerRepo } from "../../../domain/repositories/IManagerRepository";
import { EmailService } from "../../../infrastructure/services/EmailService";
import { generateRandomPassword, hashPassword } from "../../../shared/utils/password";

export class AddDepartmentWithManagerUseCase {
  constructor(
    private _departmentRepo: IDepartmentRepo,
    private _managerRepo: IManagerRepo,
    private _companyRepo: ICompanyRepository,
    private _emailService: EmailService
  ) {}

  async execute(data: {
    companyId: string;
    departmentName: string;
    managerName: string;
    managerEmail: string;
    managerPhone: string;
  }) {
    const company = await this._companyRepo.findById(data.companyId);
    if (!company) throw new Error("Company not found");

    const department = await this._departmentRepo.create({
      name: data.departmentName,
      companyId: data.companyId,
    });

    const tempPassword = generateRandomPassword();

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


    return { department, manager };
  }
}
