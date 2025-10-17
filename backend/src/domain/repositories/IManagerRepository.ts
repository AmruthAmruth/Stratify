import { Manager } from "../entities/Manager";

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
}
