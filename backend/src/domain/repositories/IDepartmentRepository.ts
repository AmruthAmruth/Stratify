import { Department } from "../entities/Department";

export interface IDepartmentRepo {
  create(department: Partial<Department>): Promise<Department>;
  update(department: Department): Promise<void>;
}