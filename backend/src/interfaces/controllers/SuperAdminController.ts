import { LoginUseCase } from "../../application/use-cases/super-admin/LoginUseCase";
import { SuperAdminRepository } from "../../infrastructure/repositories/SuperAdminRepository";
import { LoginDTO } from "../../application/dto/auth/LoginDTO";
import { Request, Response } from "express";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { LoginSchema } from "../../application/dto/auth/LoginSchema";

export class SuperAdminController {
  private loginUseCase: LoginUseCase;

  constructor() {
    const repository = new SuperAdminRepository();
    this.loginUseCase = new LoginUseCase(repository);
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = LoginSchema.safeParse(req.body);
        if (!result.success) {
    res.status(400).json({
      status: "error",
      errors: result.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
      }
      const dto: LoginDTO = {
        email: req.body.email,
        password: req.body.password,
      };
      const token = await this.loginUseCase.execute(dto);
      res
        .status(StatusCodes.OK)
        .json({ status: Messages.LOGIN_SUCCESS, token });
    } catch (error) {
      res
        .status(401)
        .json({ status: "Error", message: (error as Error).message });
    }
  }
}
