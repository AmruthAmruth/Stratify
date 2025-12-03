import { Manager } from "../entities/Manager";
import { ManagerWithDepartment } from "../../application/interfaces/managers/types";

export interface IManagerRepository {
  create(manager: Manager): Promise<Manager>;
  findById(id: string): Promise<Manager | null>;
  findByEmail(email: string): Promise<Manager | null>;
  updatePassword(email: string, password: string): Promise<void>;
  getUnassignedManagers(
    companyId: string,
  ): Promise<{ id: string; name: string }[]>;
  totalManagerInACompany(companyId: string): Promise<number>;
  findByCompanyId(companyId: string): Promise<Manager[]>;
  update(id: string, data: Partial<Manager>): Promise<Manager | null>;
  findByIdWithDepartment(id: string): Promise<ManagerWithDepartment | null>;
}
