import { Request, Response } from "express";
import { IPurchaseSubscriptionUseCase } from "../../application/interfaces/subscriptions/IPurchaseSubscriptionUseCase";
import { IListSubscriptionPlansUseCase } from "../../application/interfaces/subscriptions/IListSubscriptionPlansUseCase";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { CreatePlanSchema } from "../../application/validators/CreatePlan";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { ICreatePlanUseCase } from "../../application/interfaces/subscriptions/ICreatePlanUseCase";
import { IUpdatePlanUseCase } from "../../application/interfaces/subscriptions/IUpdatePlanUseCase";
import { IDeletePlanUseCase } from "../../application/interfaces/subscriptions/IDeletePlanUseCase";
import { ListCompanyPurchasedPlanUseCase } from "../../application/use-cases/subscriptions/ListCompanyPurchasedPlanUseCase";

export class SubscriptionController {
  constructor(
    private _purchaseSubscriptionUseCase: IPurchaseSubscriptionUseCase,
    private _listSubscriptionPlansUseCase: IListSubscriptionPlansUseCase,
    private _createPlanUseCase: ICreatePlanUseCase,
    private _updatePlanUseCase: IUpdatePlanUseCase,
    private _deletePlanUseCase: IDeletePlanUseCase,
    private _listCompanisPlanUseCase: ListCompanyPurchasedPlanUseCase,
  ) { }

  listPlans = async (_req: Request, res: Response): Promise<void> => {
    const response = await this._listSubscriptionPlansUseCase.execute();
    res.status(StatusCodes.OK).json(response);
  };

  purchasePlan = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = CreatePlanSchema.safeParse(req.body);
    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const companyId = req.userId!;
    const { planName } = req.body;
    const subscription = await this._purchaseSubscriptionUseCase.execute(
      planName,
      companyId,
    );
    res.status(StatusCodes.CREATED).json({
      message: Messages.SUBSCRIPTION_PURCHASED,
      subscription,
    });
  };

  verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    const companyId = req.userId!;
    const { orderId, paymentId, signature, planName } = req.body;
    const subscription =
      await this._purchaseSubscriptionUseCase.verifyAndActivate(
        companyId,
        planName,
        orderId,
        paymentId,
        signature,
      );
    res.status(StatusCodes.OK).json({
      message: Messages.PAYMENT_VERIFIED,
      subscription,
    });
  };

  purchasePlanForUnauthenticated = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { planName, companyId } = req.body;
    const subscription = await this._purchaseSubscriptionUseCase.execute(
      planName,
      companyId,
    );
    res.status(StatusCodes.CREATED).json({
      message: Messages.SUBSCRIPTION_PURCHASED,
      subscription,
    });
  };

  verifyPaymentForUnauthenticated = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { orderId, paymentId, signature, planName, companyId } = req.body;
    const subscription =
      await this._purchaseSubscriptionUseCase.verifyAndActivate(
        companyId,
        planName,
        orderId,
        paymentId,
        signature,
      );
    res.status(StatusCodes.OK).json({
      message: Messages.PAYMENT_VERIFIED,
      subscription,
    });
  };

  createPlan = async (req: Request, res: Response) => {
    const { plan, description, amount, durationInMonths } = req.body;
    const createdPlan = await this._createPlanUseCase.execute({
      plan,
      description,
      amount,
      durationInMonths,
    });
    res.json({ message: Messages.PLAN_CREATED, plan: createdPlan });
  };

  deletePlan = async (req: Request, res: Response) => {
    const { plan } = req.body;
    await this._deletePlanUseCase.execute(plan);
    res.status(StatusCodes.OK).json({ message: Messages.PLAN_DELETED });
  };

  updatePlan = async (req: Request, res: Response) => {
    const { plan, description, amount, durationInMonths } = req.body;
    await this._updatePlanUseCase.execute(
      plan,
      description,
      amount,
      durationInMonths,
    );
    res.status(StatusCodes.OK).json({ message: Messages.PLAN_UPDATED });
  };

  listPurchasedPlan = async (_req: Request, res: Response) => {
    const response = await this._listCompanisPlanUseCase.execute();
    res.status(StatusCodes.OK).json(response);
  };
}
