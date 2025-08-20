import { ISuperAdminRepository } from "../../domain/repositories/ISuperAdminRepository";
import { SuperAdmin } from "../../domain/entities/SuperAdmin";
import SuperAdminModel from "../models/SuperAdminModel";

export class SuperAdminRepository implements ISuperAdminRepository {
  async findByEmail(email: string): Promise<SuperAdmin | null> {
    const user = await SuperAdminModel.findOne({ email });
    if (!user) return null;
    return new SuperAdmin(user.id.toString(), user.email, user.password);
  }
}










