import { ISuperAdminRepository } from "../../domain/repositories/i-super-admin-repository";
import { SuperAdmin } from "../../domain/entities/super-admin";
import SuperAdminModel from "../models/super-admin-model";

export class SuperAdminRepository implements ISuperAdminRepository {
  async findByEmail(email: string): Promise<SuperAdmin | null> {
    const user = await SuperAdminModel.findOne({ email });
    if (!user) return null;
    return new SuperAdmin(user.id.toString(), user.email, user.password);
  }
}










