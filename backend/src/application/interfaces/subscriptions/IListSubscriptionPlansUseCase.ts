import { PlanPrice } from "../../../domain/entities/PlanPrice";

export interface IListSubscriptionPlansUseCase {
  execute(): Promise<PlanPrice[]>;
}
