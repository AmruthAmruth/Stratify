import { LoginUseCase } from "../../application/use-cases/super-admin/LoginUseCase";
import { LoginDTO } from "../../application/dto/auth/LoginDTO";
import { Request, Response } from "express";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { LoginSchema } from "../../application/dto/auth/LoginSchema";
import { RefreshTokenUseCase } from "../../application/use-cases/super-admin/RefreshTokenUseCase";

export class SuperAdminController {
 

  constructor(
    private readonly loginUseCase:LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

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
       const { accessToken, refreshToken } = await this.loginUseCase.execute(dto);

res.cookie("refreshToken",refreshToken,{
  httpOnly:true,
  secure:process.env.NODE_ENV==="production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

      res
        .status(StatusCodes.OK)
        .json({ status: Messages.LOGIN_SUCCESS, accessToken });
    } catch (error) {
      res
        .status(401)
        .json({ status: "Error", message: (error as Error).message });
    }
  }


  async refresh(req:Request,res:Response):Promise<void>{
    try{
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken){
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "No refresh token provided",
        });
        return;
      }

       const { accessToken, refreshToken: newRefreshToken } = await this.refreshTokenUseCase.execute(refreshToken);
        res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });

    }catch(error){
       res.status(StatusCodes.FORBIDDEN).json({
        message: (error as Error).message,
      });
    }
  }



}
 