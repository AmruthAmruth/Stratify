import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { GetMemberForMangerDTO, MemberDTO } from "../../dto/chat/GetMemberForManagerDTO";
import { IGetMemberForMangerUseCase } from "../../interfaces/chat/IGetMemberForMangerUseCase";

export class GetMemberForManagerUseCase implements IGetMemberForMangerUseCase {
  constructor(
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository,
    private _companyRepo: ICompanyRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(managerId: string): Promise<GetMemberForMangerDTO> {
   
    const manager = await this._managerRepo.findById(managerId);
    if (!manager) {
      throw new AppError("Manager not found", 404);
    }

    
    const department = await this._departmentRepo.findById(manager.departmentId!);
    if (!department) {
      throw new AppError("Department not found", 404);
    }

    
    const managers = await this._managerRepo.findByCompanyId(manager.companyId);
    const managersDTO: MemberDTO[] = managers.map(mgr => ({
      id: mgr.id!,         
      name: mgr.name,
      position: mgr.position,
      role: "Manager"
    }));

    
    const employees = await this._employeeRepo.findByDepartmentId(department.id!);
    const employeesDTO: MemberDTO[] = employees.map(emp => ({
      id: emp.id!,
      name: emp.name,
      position: emp.position,
      role: "Employee"
    }));

   
    const company = await this._companyRepo.findById(manager.companyId);
    if (!company) {
      throw new AppError("Company not found", 404);
    }

   
    return {
      company: {
        id: company.id,
        name: company.name
      },
      managers: managersDTO,
      employees: employeesDTO
    };
  }
}
