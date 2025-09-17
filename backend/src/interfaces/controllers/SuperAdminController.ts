
import { LoginDTO } from "../../application/dto/authentication/LoginDTO";
import { Request, Response } from "express";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { LoginSchema } from "../../application/validators/LoginValidator";
import { CookieConfig } from "../../config/CookieConfig";
import { ILoginUseCase } from "../../application/interfaces/authentication/ILoginUseCase";
import { IRefreashTokenUseCase } from "../../application/interfaces/authentication/IRefreashTokenUseCase";
import { ICreatePlanUseCase } from "../../application/interfaces/subscriptions/ICreatePlanUseCase";
import { IUpdatePlanUseCase } from "../../application/interfaces/subscriptions/IUpdatePlanUseCase";
import { IDeletePlanUseCase } from "../../application/interfaces/subscriptions/IDeletePlanUseCase";
import { IListPurchasedPlanUseCase } from "../../application/interfaces/subscriptions/IListPurchasedPlanUseCase";

export class SuperAdminController {
  constructor(
    private readonly _loginUseCase: ILoginUseCase,
    private readonly _refreshTokenUseCase: IRefreashTokenUseCase,
    private _createPlan :ICreatePlanUseCase,
    private _updatePlan:IUpdatePlanUseCase,
    private _deletePlan:IDeletePlanUseCase,
    private _listCompanyPurchasedPlan:IListPurchasedPlanUseCase

  ) {}

  login = async (req: Request, res: Response) => {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: Messages.LOGIN_FAILED,
        errors: result.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const dto: LoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const { accessToken, refreshToken } = await this._loginUseCase.execute(dto);
    res.cookie("refreshToken", refreshToken, CookieConfig);
    res.status(StatusCodes.OK).json({
      status: Messages.LOGIN_SUCCESS,
      accessToken,
    });
  };


  logout=async(_req:Request,res:Response)=>{
    res.clearCookie("refreshToken", CookieConfig);
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
  }

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: Messages.NO_REFREASHTOKEN,
      });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this._refreshTokenUseCase.execute(refreshToken);

    res.cookie("refreshToken", newRefreshToken, CookieConfig);

    res.json({ accessToken });
  };
 


  createPlan = async (req: Request, res: Response) => {
  const { plan, description, amount, durationInMonths } = req.body;
  const createdPlan = await this._createPlan.execute({ plan, description, amount, durationInMonths });
  res.json({ message: "Plan created successfully", plan: createdPlan });
};


deletePlan=async(req:Request,res:Response)=>{
  const {plan}=req.body;
  await this._deletePlan.execute(plan)
  res.status(StatusCodes.OK).json({message:"Deleted Plan Successfully"})
}


updatePlan=async(req:Request,res:Response)=>{
  
  
  const { plan, description, amount, durationInMonths } = req.body;
  await this._updatePlan.execute(plan, description, amount, durationInMonths);
  res.status(StatusCodes.OK).json({message:"Updated Plan Successfully"})

}



listPurchasedPlan=async(_req:Request,res:Response)=>{
  
  
const response=  await this._listCompanyPurchasedPlan.execute();
  res.status(StatusCodes.OK).json(response)

}

}
