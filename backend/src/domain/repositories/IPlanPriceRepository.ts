import { PlanPrice } from "../../domain/entities/PlanPrice";

export interface IPlanPriceRepository {
  getPlan(plan: string): Promise<PlanPrice | null>;
  setPlan(
    plan: string,
    discription: string,
    amount: number,
    durationInMonths: number,
  ): Promise<void>;
  listPlans(): Promise<PlanPrice[]>;
  deletePlan(plan: string): Promise<void>;
  updatePlan(
    plan: string,
    discription: string,
    amount: number,
    durationInMonths: number,
  ): Promise<void>;
}
