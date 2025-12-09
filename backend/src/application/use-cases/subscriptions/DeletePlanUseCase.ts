import { IPlanPriceRepository } from "../../../domain/repositories/IPlanPriceRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { IDeletePlanUseCase } from "../../interfaces/subscriptions/IDeletePlanUseCase";

export class DeletePlanUseCase implements IDeletePlanUseCase {
  constructor(private _planPrice: IPlanPriceRepository) { }

  async execute(plan: string): Promise<void> {
    const existingPlan = await this._planPrice.getPlan(plan);
    if (!existingPlan) {
      throw new AppError(Messages.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    await this._planPrice.deletePlan(plan);
  }
}
