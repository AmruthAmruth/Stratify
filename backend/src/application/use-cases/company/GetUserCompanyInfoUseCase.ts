import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";

export class GetUserCompanyInfoUseCase {
  constructor(
    private _companyRepository: ICompanyRepository,
    private _managerRepository: IManagerRepository,
    private _employeeRepository: IEmployeeRepository
  ) {}

  async execute(userId: string, role: string): Promise<{ id: string; name: string; profileImage?: string }> {
    let companyId: string;

    if (role === "company") {
     
      companyId = userId;
    } else if (role === "manager") {
     
      const manager = await this._managerRepository.findById(userId);
      if (!manager) {
        throw new AppError("Manager not found", 404);
      }
      companyId = manager.companyId;
    } else if (role === "employee") {
      
      const employee = await this._employeeRepository.findById(userId);
      if (!employee) {
        throw new AppError("Employee not found", 404);
      }
      companyId = employee.companyId;
    } else {
      throw new AppError("Invalid role", 400);
    }

    
    const company = await this._companyRepository.findById(companyId);
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    return {
      id: company.id!,
      name: company.name,
      profileImage: company.profileImage
    };
  }
}
