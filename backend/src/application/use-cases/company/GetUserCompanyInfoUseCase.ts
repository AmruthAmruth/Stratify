import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { IGetUserCompanyInfoUseCase } from "../../interfaces/company/IGetUserCompanyInfoUseCase";

export class GetUserCompanyInfoUseCase implements IGetUserCompanyInfoUseCase{
  constructor(
    private _companyRepository: ICompanyRepository,
    private _managerRepository: IManagerRepository,
    private _employeeRepository: IEmployeeRepository
  ) { }

  async execute(userId: string, role: string): Promise<{ id: string; name: string; profileImage?: string }> {
    let companyId: string;

    if (role === "company") {

      companyId = userId;
    } else if (role === "manager") {

      const manager = await this._managerRepository.findById(userId);
      if (!manager) {
        throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
      }
      companyId = manager.companyId;
    } else if (role === "employee") {

      const employee = await this._employeeRepository.findById(userId);
      if (!employee) {
        throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
      }
      companyId = employee.companyId;
    } else {
      throw new AppError(Messages.INVALID_ROLE, StatusCodes.BAD_REQUEST);
    }


    const company = await this._companyRepository.findById(companyId);
    if (!company) {
      throw new AppError(Messages.COMPANY_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return {
      id: company.id!,
      name: company.name,
      profileImage: company.profileImage
    };
  }
}
