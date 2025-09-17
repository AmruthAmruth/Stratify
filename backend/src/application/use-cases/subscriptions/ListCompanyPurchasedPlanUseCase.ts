import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/ISubscriptionRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { PurchasePlanDTO } from "../../dto/subscriptions/CompanyPurchasedPlanDTO";
import { IListPurchasedPlanUseCase } from "../../interfaces/subscriptions/IListPurchasedPlanUseCase";

export class ListCompanyPurchasedPlanUseCase implements IListPurchasedPlanUseCase {
  constructor(
    private _subscriptionRepo: ISubscriptionRepository,
    private _companyRepo: ICompanyRepository
  ) {}

  async execute(): Promise<PurchasePlanDTO[]> {
    const plans = await this._subscriptionRepo.listAllPlan();

    if (plans.length === 0) {
      throw new AppError("No purchased plans found", 404);
    }

    const purchasedPlans: PurchasePlanDTO[] = [];

    for (const plan of plans) {
      const company = await this._companyRepo.findById(plan.companyId);
      if (!company) continue; 

      const validityInMonths = this.calculateValidity(plan.startDate, plan.endDate);

      purchasedPlans.push({
        companyName: company.name,
        plan: plan.plan,
        validityInMonths,
        amount: plan.amount,
        startDate: plan.startDate,
        endDate: plan.endDate,
        transactionId: plan.paymentId,
        status: plan.status as "active" | "expired" | "pending",
      });
    }

    return purchasedPlans;
  }

  private calculateValidity(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  }
}
