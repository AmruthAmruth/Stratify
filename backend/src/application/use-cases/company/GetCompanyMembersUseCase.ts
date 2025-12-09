import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import {
  CompanyMembersDTO,
  MemberDTO,
} from "../../dto/company/CompanyMembersDTO";
import { IGetCompanyMemebersUseCase } from "../../interfaces/company/IGetCompanyMembersUseCase";

export class GetCompanyMemebersUseCase implements IGetCompanyMemebersUseCase {
  constructor(
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository,
    private _departmentRepo: IDepartmentRepository,
  ) { }
  async execute(companyId: string): Promise<CompanyMembersDTO> {
    if (!companyId) {
      throw new AppError(Messages.COMPANY_ID_REQUIRED, StatusCodes.FORBIDDEN);
    }

    const managers = await this._managerRepo.findByCompanyId(companyId);
    const employees = await this._employeeRepo.findByCompanyId(companyId);

    if (
      (!managers || managers.length === 0) &&
      (!employees || employees.length === 0)
    ) {
      throw new AppError(Messages.NO_MEMBERS_FOUND, StatusCodes.NOT_FOUND);
    }

    const getDepartmentName = async (departmentId?: string) => {
      if (!departmentId) return undefined;
      const dept = await this._departmentRepo.findById(departmentId);
      return dept?.name;
    };

    const managersDTO: MemberDTO[] = await Promise.all(
      (managers || []).map(async (manager) => ({
        name: manager.name,
        department: await getDepartmentName(manager.departmentId),
        position: manager.position,
        email: manager.email,
        phone: manager.phone,
        role: "Manager",
      })),
    );

    const employeesDTO: MemberDTO[] = await Promise.all(
      (employees || []).map(async (employee) => ({
        name: employee.name,
        department: await getDepartmentName(employee.departmentId),
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        role: "Employee",
      })),
    );

    const companyMembers: CompanyMembersDTO = {
      totalEmployees: employeesDTO.length,
      totalManagers: managersDTO.length,
      employees: employeesDTO,
      managers: managersDTO,
    };

    return companyMembers;
  }
}
