import { PlanPrice } from "../../../domain/entities/PlanPrice";
import { PlanPriceRepostory } from "../../../infrastructure/repositories/PlanPriceRepository";
import { IListSubscriptionPlansUseCase } from "../../interfaces/subscriptions/IListSubscriptionPlansUseCase";




export class ListSubscriptionPlansUseCase implements IListSubscriptionPlansUseCase{
    constructor(
        private _planPriceRepo:PlanPriceRepostory
    ){}
   async execute(): Promise<PlanPrice[]> {
        const plans = await this._planPriceRepo.listPlans()
        return plans
    }
}