import { AddDepartmentWithManagerDTO } from "../../dto/company/AddDepartmentWithManagerDTO";
import { AddDepartmentWithManagerResponse } from "../../dto/company/AddDepartmentWithManagerResponse";

export interface IAddDepartmentWithManagerUseCase {
  execute(data: AddDepartmentWithManagerDTO): Promise<AddDepartmentWithManagerResponse>;
} 