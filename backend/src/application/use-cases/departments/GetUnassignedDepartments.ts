import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { UnassignedDepartmentDTO } from "../../dto/departments/UnassignedDepartmentDTO";
import { IGetUnassignedDepartments } from "../../interfaces/departments/IGetUnassignedDepartmentsUseCase";

export class GetUnassignedDepartmentUseCase
  implements IGetUnassignedDepartments
{
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(companyId: string): Promise<UnassignedDepartmentDTO[]> {
    const managers =
      await this._departmentRepo.getUnassignedDepartments(companyId);
    return managers.map((m) => ({ id: m.id!, name: m.name }));
  }
}
