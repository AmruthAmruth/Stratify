import { SuperAdmin } from "../entities/SuperAdmin";

export interface ISuperAdminRepository {
  findByEmail(email: string): Promise<SuperAdmin | null>;
  findById(id: string): Promise<SuperAdmin | null>;
  update(superAdmin: SuperAdmin): Promise<SuperAdmin>;
}
