import { PlanPrice } from "../../../domain/entities/PlanPrice";
import { CreatePlanDTO } from "../../dto/subscriptions/CreatePlanDTO";

export interface ICreatePlanUseCase {
  execute(input: CreatePlanDTO): Promise<PlanPrice>;
}
