import { UnassignedDepartmentDTO } from "../../dto/departments/UnassignedDepartmentDTO";

export interface IGetUnassignedDepartments {
  execute(companyId: string): Promise<UnassignedDepartmentDTO[]>;
}
