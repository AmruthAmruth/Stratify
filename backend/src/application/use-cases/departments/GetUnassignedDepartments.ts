import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { UnassignedDepartmentDTO } from "../../dto/departments/UnassignedDepartmentDTO";
import { IGetUnassignedDepartments } from "../../interfaces/departments/IGetUnassignedDepartmentsUseCase";
import { DepartmentMapper } from "../../mappers/DepartmentMapper";

export class GetUnassignedDepartmentUseCase
  implements IGetUnassignedDepartments
{
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(companyId: string): Promise<UnassignedDepartmentDTO[]> {
    const unassignedDepartments =
      await this._departmentRepo.getUnassignedDepartments(companyId);

    return unassignedDepartments.map((dept) =>
      DepartmentMapper.toUnassignedDepartmentDTO(dept),
    );
  }
}
