
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { SubscriptionRepository } from "../infrastructure/repositories/SubscriptionRepository";
import { PlanPriceRepostory } from "../infrastructure/repositories/PlanPriceRepository";
import { RazorpayService } from "../infrastructure/services/RazorpayService";
import { EmailService } from "../infrastructure/services/EmailService";
import { PurchaseSubscriptionUseCase } from "../application/use-cases/subscriptions/PurchaseSubscriptionUseCase";
import { ListSubscriptionPlansUseCase } from "../application/use-cases/subscriptions/ListSubscriptionPlansUseCase";
import { SubscriptionController } from "../interfaces/controllers/SubscriptionController";
import { CreatePlanUseCase } from "../application/use-cases/subscriptions/CreatePlanUseCase";
import { UpdatePlanUseCase } from "../application/use-cases/subscriptions/UpdatePlanUseCase";
import { DeletePlanUseCase } from "../application/use-cases/subscriptions/DeletePlanUseCase";
import { ListCompanyPurchasedPlanUseCase } from "../application/use-cases/subscriptions/ListCompanyPurchasedPlanUseCase";

export const subscriptionDI = () => {
  const companyRepo = new companyRepository();
  const subscriptionRepo = new SubscriptionRepository();
  const planRepo = new PlanPriceRepostory();
  const razorpayService = new RazorpayService();
  const emailService = new EmailService();

  const purchaseSubscriptionUseCase = new PurchaseSubscriptionUseCase(subscriptionRepo, planRepo, razorpayService, emailService, companyRepo);
  const listSubscriptionPlansUseCase = new ListSubscriptionPlansUseCase(planRepo);
const createPlanUseCase = new CreatePlanUseCase(planRepo);
  const updatePlanUseCase = new UpdatePlanUseCase(planRepo);
  const deletePlanUseCase = new DeletePlanUseCase(planRepo);
 const listCompanyPurchasedPlanUseCase = new ListCompanyPurchasedPlanUseCase(subscriptionRepo, companyRepo);
 
 return new SubscriptionController(
    purchaseSubscriptionUseCase,
    listSubscriptionPlansUseCase,
    createPlanUseCase,
    updatePlanUseCase,
    deletePlanUseCase,
listCompanyPurchasedPlanUseCase
  );
};