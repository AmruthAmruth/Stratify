import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IGetDepartmentUnderManagerUseCase } from "../../interfaces/company/IGetDepartmentsUnderManagerUseCase";
import { ManagerDepartmentResponseDTO } from "../../dto/company/ManagerDepartmentResponseDTO";

export class GetManagerDepartmentsUseCase implements IGetDepartmentUnderManagerUseCase {
  constructor(
    private _departmentRepo: IDepartmentRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(managerId: string): Promise<ManagerDepartmentResponseDTO[]> {
    
    const departments = await this._departmentRepo.findByManagerId(managerId);

    if (!departments || departments.length === 0) {
      return [];
    }

    const results: ManagerDepartmentResponseDTO[] = [];
    for (const dept of departments) {
      const memberCount = await this._employeeRepo.totalEmployeeInADepartment(dept.id);
      results.push({
        id: dept.id,
        name: dept.name,
        memberCount,
        status: "Active" 
      });
    }

    return results;
  }
}
