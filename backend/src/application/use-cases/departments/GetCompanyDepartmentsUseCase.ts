import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { DepartmentDetails } from "../../dto/departments/CompanyDepartmentsDTO";
import { IGetCompanyDepartmentUseCase } from "../../interfaces/departments/IGetCompanyDepartmentsUseCase";

export class GetCompanyDepartmentUseCase
  implements IGetCompanyDepartmentUseCase
{
  constructor(
    private _departmentRepo: IDepartmentRepository,
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository,
  ) {}
  async execute(companyId: string): Promise<DepartmentDetails[]> {
    const departments =
      await this._departmentRepo.findDepartmentsByCompanyId(companyId);

    const enrichedDepartments: DepartmentDetails[] = await Promise.all(
      departments.map(async (dept) => {
        let managerName = "Unassigned";

        if (dept.managerId) {
          const manager = await this._managerRepo.findById(dept.managerId);
          if (manager) managerName = manager.name;
        }

        const numOfEmployees =
          await this._employeeRepo.totalEmployeeInADepartment(dept.id!);

        return {
          id: dept.id!,
          name: dept.name,
          description: dept.description,
          managerName,
          numOfEmployees,
        };
      }),
    );

    return enrichedDepartments;
  }
}
