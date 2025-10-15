import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { GetMemberForCompanyDTO, MemberDTO } from "../../dto/chat/GetMemberForCompanyDTO";
import { IGetMemberForCompanyUseCase } from "../../interfaces/chat/IGetMemberForCompanyUseCase";

export class GetMemberForCompanyUseCase implements IGetMemberForCompanyUseCase {
  constructor(
    private _companyRepo: ICompanyRepository,
    private _employeeRepo: IEmployeeRepository,
    private _managerRepo: IManagerRepository
  ) {}

  async execute(companyId: string): Promise<GetMemberForCompanyDTO> {
 
    const company = await this._companyRepo.findById(companyId);
    if (!company) {
      throw new AppError("Company not found", StatusCodes.NOT_FOUND);
    }

    const [managers, employees] = await Promise.all([
      this._managerRepo.findByCompanyId(companyId),
      this._employeeRepo.findByCompanyId(companyId),
    ]);
    const managersDTO: MemberDTO[] = managers.map((manager) => ({
      id: manager.id!,
      name: manager.name,
      position: manager.position,
      role: "Manager",
    }));

    const employeesDTO: MemberDTO[] = employees.map((emp) => ({
      id: emp.id!,
      name: emp.name,
      position: emp.position,
      role: "Employee",
    }));

    return {
      company: {
        id: company.id,
        name: company.name,
      },
      managers: managersDTO,
      employees: employeesDTO,
    };
  }
}
