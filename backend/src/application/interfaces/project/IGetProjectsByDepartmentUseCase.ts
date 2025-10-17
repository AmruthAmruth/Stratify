import { GetProjectsByDepartmentResponse } from "../../dto/project/GetProjectsByDepartmentDTO";

export interface IGetProjectsByDepartmentUseCase {
  execute(managerId: string): Promise<GetProjectsByDepartmentResponse>;
}
