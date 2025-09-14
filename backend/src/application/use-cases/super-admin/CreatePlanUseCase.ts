import { PlanPrice } from "../../../domain/entities/PlanPrice";
import { IPlanPriceRepository } from "../../../domain/repositories/IPlanPriceRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreatePlanDTO } from "../../dto/company/CreatePlanDTO";
import { ICreatePlanUseCase } from "../../interfaces/super-admin/ICreatePlanUseCase";



export class CreatePlanUseCase implements ICreatePlanUseCase{
    constructor(
        private _planPriceRepo:IPlanPriceRepository
    ){}

    async execute(input: CreatePlanDTO): Promise<PlanPrice> {
        const existingPlan = await this._planPriceRepo.getPlan(input.plan);
    if (existingPlan) {
      throw new AppError(`Plan "${input.plan}" already exists`);
    }


    const plan = new PlanPrice(input.plan, input.amount, input.durationInMonths);


 await this._planPriceRepo.setPlan(plan.plan, plan.amount, plan.durationInMonths);

    return plan;

    }
}