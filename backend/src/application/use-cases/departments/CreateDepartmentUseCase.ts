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
import { Notification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class CreateDepartmentUseCase implements ICreateDepartmentUseCase {
  constructor(
    private readonly _departmentRepo: IDepartmentRepository,
    private readonly _managerRepo: IManagerRepository,
    private readonly _companyRepo: ICompanyRepository,
    private readonly _emailService: IEmailService,
    private readonly _notificationRepo: INotificationRepository

  ) { }

  async execute(data: CreateDepartmentDTO): Promise<Department> {

    const company = await this._companyRepo.findById(data.companyId);
    if (!company) {
      throw new AppError(Messages.COMPANY_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const existingDepartment = await this._departmentRepo.findByNameAndCompany(
      data.name,
      data.companyId
    );
    if (existingDepartment) {
      throw new AppError(Messages.DEPARTMENT_EXISTS, StatusCodes.BAD_REQUEST);
    }

    let managerEmail: string | null = null;
    let managerName: string | null = null;

    if (data.managerId) {
      const manager = await this._managerRepo.findById(data.managerId);
      if (!manager) {
        throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
      }

      if (manager.departmentId) {
        throw new AppError(
          Messages.MANAGER_ALREADY_ASSIGNED,
          StatusCodes.BAD_REQUEST
        );
      }

      const notification = new Notification(
        manager.id!,
        manager.role,
        "Department Assignment",
        `🎉 Congratulations ${manager.name}! You have been assigned as the Manager of ${data.name} department.`,
        "success"
      );

      await this._notificationRepo.create(notification);

      managerEmail = manager.email;
      managerName = manager.name;
    }

    const department = DepartmentMapper.toDomain(data);
    const createdDepartment = await this._departmentRepo.create(department);

    if (managerEmail && managerName) {
      const html = departmentManagerAssignedTemplate(
        managerName,
        createdDepartment.name,
        company.name
      );

      await this._emailService.sendEmail(
        managerEmail,
        `You have been assigned as Manager of ${createdDepartment.name}`,
        html
      );
    }

    return createdDepartment;
  }
}
