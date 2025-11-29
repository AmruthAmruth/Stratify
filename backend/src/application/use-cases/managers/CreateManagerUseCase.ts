import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { Messages } from "../../../shared/constants/messages";
import {
  generateRandomPassword,
  hashPassword,
} from "../../../shared/utils/password";
import { CreateManagerDTO } from "../../dto/managers/CreateManagerDTO";
import { ICreateManagerUseCase } from "../../interfaces/managers/ICreateManagerUseCase";
import { managerWelcomeTemplate } from "../../../shared/templates/ManagerWelcomeTemplate";
import { ManagerMapper } from "../../mappers/ManagerMapper";
import { Manager } from "../../../domain/entities/Manager";

export class CreateManagerUseCase implements ICreateManagerUseCase {
  constructor(
    private _companyRepo: ICompanyRepository,
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository,
    private _emailService: IEmailService,

  ) { }

  async execute(managerDto: CreateManagerDTO): Promise<Manager> {
    const company = await this._companyRepo.findById(managerDto.companyId);
    if (!company) {
      throw new Error(Messages.COMPANY_NOT_FOUND);
    }

    const existingManager = await this._managerRepo.findByEmail(
      managerDto.email,
    );
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

    const manager = ManagerMapper.toDomain(managerDto, hashedPassword);

    const createdManager = await this._managerRepo.create(manager);

    if (managerDto.departmentId) {
      await this._departmentRepo.assignManager(
        managerDto.departmentId,
        createdManager.id!,
      );
    }

    const html = managerWelcomeTemplate(
      createdManager.name,
      company.name,
      createdManager.position,
      tempPassword,
      department ? department.name : undefined,
    );

    await this._emailService.sendEmail(
      createdManager.email,
      `Welcome to ${company.name} as Manager`,
      html,
    );

    return createdManager;
  }
}
