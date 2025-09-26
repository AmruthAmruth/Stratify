import { SuperAdminController } from "../interfaces/controllers/SuperAdminController";

// Repositories
import { SuperAdminRepository } from "../infrastructure/repositories/SuperAdminRepository";
import { PlanPriceRepostory } from "../infrastructure/repositories/PlanPriceRepository";
import { SubscriptionRepository } from "../infrastructure/repositories/SubscriptionRepository";
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";

// Authentication Use Cases
import { LoginUseCase } from "../application/use-cases/authentication/LoginUseCase";
import { RefreshTokenUseCase } from "../application/use-cases/authentication/RefreashTokenUseCase";

// Subscription Use Cases
import { CreatePlanUseCase } from "../application/use-cases/subscriptions/CreatePlanUseCase";
import { UpdatePlanUseCase } from "../application/use-cases/subscriptions/UpdatePlanUseCase";
import { DeletePlanUseCase } from "../application/use-cases/subscriptions/DeletePlanUseCase";
import { ListCompanyPurchasedPlanUseCase } from "../application/use-cases/subscriptions/ListCompanyPurchasedPlanUseCase";

export const superAdminDI = () => {
  // Repositories
  const superAdminRepo = new SuperAdminRepository();
  const planPriceRepo = new PlanPriceRepostory();
  const subscriptionRepo = new SubscriptionRepository();
  const companyRepo = new companyRepository();

  // Authentication Use Cases
  const loginUseCase = new LoginUseCase(superAdminRepo);
  const refreshTokenUseCase = new RefreshTokenUseCase();

  // Subscription Use Cases
  const createPlanUseCase = new CreatePlanUseCase(planPriceRepo);
  const updatePlanUseCase = new UpdatePlanUseCase(planPriceRepo);
  const deletePlanUseCase = new DeletePlanUseCase(planPriceRepo);
  const listCompanyPurchasedPlanUseCase = new ListCompanyPurchasedPlanUseCase(subscriptionRepo, companyRepo);

  // Controller
  const controller = new SuperAdminController(
    loginUseCase,
    refreshTokenUseCase,
    createPlanUseCase,
    updatePlanUseCase,
    deletePlanUseCase,
    listCompanyPurchasedPlanUseCase
  );

  return controller;
};
