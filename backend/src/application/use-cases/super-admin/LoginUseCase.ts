import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository";
import { LoginDTO } from "../../dto/auth/LoginDTO";
import { comparePassword } from "../../../shared/utils/passwordHash";
import { generateRefreshToken, generateAccessToken } from "../../../shared/utils/token";

export class LoginUseCase {
  constructor(private superAdminRepository: ISuperAdminRepository) {}

  async execute(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.superAdminRepository.findByEmail(data.email);
    if (!user) throw new Error("Super Admin not found");

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const payload = { id: user.id, role: "super-admin" };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}






