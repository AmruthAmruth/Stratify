import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ManagerDepartmentResponseDTO } from "../../dto/departments/ManagerDepartmentResponseDTO";
import { IGetManagerDepartmentsUseCase } from "../../interfaces/departments/IGetManagerDepartmentsUseCase";
import { DepartmentMapper } from "../../mappers/DepartmentMapper";

export class GetManagerDepartmentsUseCase
  implements IGetManagerDepartmentsUseCase
{
  constructor(
    private _departmentRepo: IDepartmentRepository,
    private _employeeRepo: IEmployeeRepository,
  ) {}

  async execute(managerId: string): Promise<ManagerDepartmentResponseDTO[]> {
    const departments = await this._departmentRepo.findByManagerId(managerId);

    if (!departments || departments.length === 0) {
      return [];
    }

    const results = await Promise.all(
      departments.map(async (dept) => {
        const memberCount = await this._employeeRepo.totalEmployeeInADepartment(
          dept.id,
        );
        return DepartmentMapper.toManagerDepartmentDTO(dept, memberCount);
      }),
    );

    return results;
  }
}
