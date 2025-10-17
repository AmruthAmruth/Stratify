import { DepartmentLeaveDTO } from "../../dto/leave/GetDepartmentLeaveDTO";

export interface IGetDepartmentLeaveUseCase {
  execute(managerId: string): Promise<DepartmentLeaveDTO>;
}
