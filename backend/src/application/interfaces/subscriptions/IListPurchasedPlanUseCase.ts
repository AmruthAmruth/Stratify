import { PurchasePlanDTO } from "../../dto/subscriptions/CompanyPurchasedPlanDTO";



export interface IListPurchasedPlanUseCase{
    execute():Promise<PurchasePlanDTO[]>
}