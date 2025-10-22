import { Department } from "../../../domain/entities/Department";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { CreateDepartmentDTO } from "../../dto/departments/CreateDepartmentDTO";
import { ICreateDepartmentUseCase } from "../../interfaces/departments/ICreateDepartmentUseCase";
import { departmentManagerAssignedTemplate } from "../../../shared/templates/DepartmentManagerAssignedTemplate";
import { DepartmentMapper } from "../../mappers/DepartmentMapper";

export class CreateDepartmentUseCase implements ICreateDepartmentUseCase {
  constructor(
    private _departmentRepo: IDepartmentRepository,
    private _managerRepo: IManagerRepository,
    private _companyRepo: ICompanyRepository,
    private _emailService: IEmailService,
  ) {}

  async execute(data: CreateDepartmentDTO): Promise<Department> {
    const company = await this._companyRepo.findById(data.companyId);
    if (!company) {
      throw new AppError(Messages.COMPANY_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const existingDepartment = await this._departmentRepo.findByNameAndCompany(
      data.name,
      data.companyId,
    );
    if (existingDepartment) {
      throw new AppError("Department already exists", 400);
    }

    let managerEmail: string | null = null;
    let managerName: string | null = null;

    if (data.managerId) {
      const manager = await this._managerRepo.findById(data.managerId);
      if (!manager) {
        throw new AppError("Manager not found", 404);
      }
      if (manager.departmentId) {
        throw new AppError(
          "Manager is already assigned to another department",
          400,
        );
      }
      managerEmail = manager.email;
      managerName = manager.name;
    }
    
   const department = DepartmentMapper.toDomain(data);

    const createdDepartment = await this._departmentRepo.create(department);

    if (managerEmail && managerName) {
      const html = departmentManagerAssignedTemplate(
        managerName,
        createdDepartment.name,
        company.name,
      );

      await this._emailService.sendEmail(
        managerEmail,
        `You have been assigned as Manager of ${createdDepartment.name}`,
        html,
      );
    }

    return createdDepartment;
  }
}
