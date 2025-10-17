import { IPlanPriceRepository } from "../../../domain/repositories/IPlanPriceRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { IDeletePlanUseCase } from "../../interfaces/subscriptions/IDeletePlanUseCase";

export class DeletePlanUseCase implements IDeletePlanUseCase {
  constructor(private _planPrice: IPlanPriceRepository) {}

  async execute(plan: string): Promise<void> {
    const existingPlan = await this._planPrice.getPlan(plan);
    if (!existingPlan) {
      throw new AppError(`Plan "${plan}" does not exist`);
    }

    await this._planPrice.deletePlan(plan);
  }
}
