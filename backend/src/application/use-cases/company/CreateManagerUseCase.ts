import { Manager } from "../../../domain/entities/Manager";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { Messages } from "../../../shared/constants/messages";
import { generateRandomPassword, hashPassword } from "../../../shared/utils/password";
import { CreateManagerDTO } from "../../dto/company/CreateManagerDTO";
import { ICreateManagerUseCase } from "../../interfaces/company/ICreateManagerUseCase";

export class CreateManagerUseCase implements ICreateManagerUseCase {
  constructor(
    private _companyRepo: ICompanyRepository,
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository,
    private _emailService: IEmailService
  ) {}

  async execute(managerDto: CreateManagerDTO): Promise<Manager> {
    
    const company = await this._companyRepo.findById(managerDto.companyId);
    if (!company) {
      throw new Error(Messages.COMPANY_NOT_FOUND);
    }

  
    const existingManager = await this._managerRepo.findByEmail(managerDto.email);
    if (existingManager) {
      throw new Error(Messages.EMAIL_ALREADY_EXISTS);
    }

    
    let department = null;
    if (managerDto.departmentId) {
      department = await this._departmentRepo.findById(managerDto.departmentId);

      if (!department || department.companyId !== managerDto.companyId) {
        throw new Error("Department Not Found");
      }

      if (department.managerId) {
        throw new Error("Department Already Have a Manager");
      }
    }

    const tempPassword = await generateRandomPassword();
    const hashedPassword = await hashPassword(tempPassword);

   
    const manager = new Manager(
      undefined,
      managerDto.name,
      managerDto.email,
      managerDto.phone,
      hashedPassword,
      "manager",
      managerDto.position,
      managerDto.joiningDate,
      managerDto.gender,
      managerDto.dob,
      managerDto.companyId,
      managerDto.departmentId,
      managerDto.profileImage
    );

    const createdManager = await this._managerRepo.create(manager);

    
    if (managerDto.departmentId) {
      await this._departmentRepo.assignManager(managerDto.departmentId, createdManager.id!);
    }

   
    await this._emailService.sendEmail(
      createdManager.email,
      `Welcome to ${company.name} as Manager`,
      `Hello ${createdManager.name},

      You have been successfully added as a Manager at ${company.name}${
        department ? ` in the "${department.name}" department` : ""
      }.

      Your temporary login password is: ${tempPassword}

      Please log in and change your password as soon as possible.

      Best regards,  
      ${company.name} HR`
    );

    return createdManager;
  }
}
