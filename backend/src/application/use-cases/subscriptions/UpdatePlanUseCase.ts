import { IPlanPriceRepository } from "../../../domain/repositories/IPlanPriceRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { IUpdatePlanUseCase } from "../../interfaces/subscriptions/IUpdatePlanUseCase";




export class UpdatePlanUseCase implements IUpdatePlanUseCase{
    constructor(
            private _planPrice:IPlanPriceRepository
    ){}

    async execute(plan: string, description: string, amount: number, durationInMonths: number): Promise<void> {
        
        const existingPlan = await this._planPrice.getPlan(plan);
        if (!existingPlan) {
            throw new AppError(`Plan "${plan}" does not exist`);
        }

        await this._planPrice.updatePlan(plan, description, amount, durationInMonths);
    }
}