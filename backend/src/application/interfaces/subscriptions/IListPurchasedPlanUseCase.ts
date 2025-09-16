import { PurchasePlanDTO } from "../../dto/company/CompanyPurchasedPlanDTO";



export interface IListPurchasedPlanUseCase{
    execute():Promise<PurchasePlanDTO[]>
}