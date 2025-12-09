import { ISuperAdminRepository } from "../../domain/repositories/ISuperAdminRepository";
import { SuperAdmin } from "../../domain/entities/SuperAdmin";
import SuperAdminModel from "../models/SuperAdminModel";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";

export class SuperAdminRepository implements ISuperAdminRepository {
  async findByEmail(email: string): Promise<SuperAdmin | null> {
    const user = await SuperAdminModel.findOne({ email });
    if (!user) return null;
    return new SuperAdmin(
      user.id.toString(),
      user.email,
      user.password,
      user.name,
      user.profileImage
    );
  }

  async findById(id: string): Promise<SuperAdmin | null> {
    const user = await SuperAdminModel.findById(id);
    if (!user) return null;
    return new SuperAdmin(
      user.id.toString(),
      user.email,
      user.password,
      user.name,
      user.profileImage
    );
  }

  async update(superAdmin: SuperAdmin): Promise<SuperAdmin> {
    const updatedUser = await SuperAdminModel.findByIdAndUpdate(
      superAdmin.id,
      {
        name: superAdmin.name,
        profileImage: superAdmin.profileImage,
        email: superAdmin.email,
        password: superAdmin.password,
      },
      { new: true }
    );

    if (!updatedUser) throw new AppError(Messages.SUPER_ADMIN_NOT_FOUND, StatusCodes.NOT_FOUND);

    return new SuperAdmin(
      updatedUser.id.toString(),
      updatedUser.email,
      updatedUser.password,
      updatedUser.name,
      updatedUser.profileImage
    );
  }
}
