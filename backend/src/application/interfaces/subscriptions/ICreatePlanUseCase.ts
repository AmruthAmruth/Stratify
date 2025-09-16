import { PlanPrice } from "../../../domain/entities/PlanPrice";
import { CreatePlanDTO } from "../../dto/company/CreatePlanDTO";


export interface ICreatePlanUseCase{
    execute(input:CreatePlanDTO):Promise<PlanPrice>
}