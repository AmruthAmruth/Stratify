import { Department } from "../entities/Department";

export interface IDepartmentRepository {
  findByNameAndCompany(
    name: string,
    companyId: string,
  ): Promise<Department | null>;

  create(department: Department): Promise<Department>;
  findById(id: string): Promise<Department | null>;
  assignManager(departmentId: string, managerId: string): Promise<void>;
  findDepartmentsByCompanyId(companyId: string): Promise<Department[]>;
  getUnassignedDepartments(
    companyId: string,
  ): Promise<{ id: string; name: string }[]>;
  findByManagerId(managerId: string): Promise<{ id: string; name: string }[]>;
}
