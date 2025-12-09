import { PlanPrice } from "../../../domain/entities/PlanPrice";
import { IPlanPriceRepository } from "../../../domain/repositories/IPlanPriceRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { CreatePlanDTO } from "../../dto/subscriptions/CreatePlanDTO";
import { ICreatePlanUseCase } from "../../interfaces/subscriptions/ICreatePlanUseCase";

export class CreatePlanUseCase implements ICreatePlanUseCase {
  constructor(private _planPriceRepo: IPlanPriceRepository) { }

  async execute(input: CreatePlanDTO): Promise<PlanPrice> {
    const existingPlan = await this._planPriceRepo.getPlan(input.plan);
    if (existingPlan) {
      throw new AppError(Messages.PLAN_ALREADY_EXISTS, StatusCodes.CONFLICT);
    }

    const plan = new PlanPrice(
      input.plan,
      input.description,
      input.amount,
      input.durationInMonths,
    );

    await this._planPriceRepo.setPlan(
      plan.plan,
      plan.description,
      plan.amount,
      plan.durationInMonths,
    );

    return plan;
  }
}
