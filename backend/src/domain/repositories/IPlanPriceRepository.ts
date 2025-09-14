import { PlanPrice } from "../../domain/entities/PlanPrice";

export interface IPlanPriceRepository {
  getPlan(plan: string): Promise<PlanPrice | null>;
  setPlan(plan: string, amount: number, durationInMonths: number): Promise<void>;
  listPlans(): Promise<PlanPrice[]>;
}