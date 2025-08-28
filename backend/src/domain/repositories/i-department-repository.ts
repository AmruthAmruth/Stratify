import { Department } from "../entities/department";

export interface IDepartmentRepo {
  create(department: Partial<Department>): Promise<Department>;
  update(department: Department): Promise<void>;
  findById(id:string):Promise<Department|null>
}