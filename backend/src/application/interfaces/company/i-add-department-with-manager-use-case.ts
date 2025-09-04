import { AddDepartmentWithManagerDTO } from "../../dto/company/add-department-with-manager-dto";
import { AddDepartmentWithManagerResponse } from "../../dto/company/add-department-with-manager-response-dto";

export interface IAddDepartmentWithManagerUseCase {
  execute(data: AddDepartmentWithManagerDTO): Promise<AddDepartmentWithManagerResponse>;
} 