
import { CreatePlanUseCase } from "../application/use-cases/subscriptions/CreatePlanUseCase";
import { DeletePlanUseCase } from "../application/use-cases/subscriptions/DeletePlanUseCase";
import { ListCompanyPurchasedPlanUseCase } from "../application/use-cases/subscriptions/ListCompanyPurchasedPlanUseCase";
import { LoginUseCase } from "../application/use-cases/authentication/LoginUseCase"
import { RefreshTokenUseCase } from "../application/use-cases/authentication/RefreashTokenUseCase";
import { UpdatePlanUseCase } from "../application/use-cases/subscriptions/UpdatePlanUseCase";
import { PlanPriceRepostory } from "../infrastructure/repositories/PlanPriceRepository";
import { SuperAdminRepository } from "../infrastructure/repositories/SuperAdminRepository"
import { SuperAdminController } from "../interfaces/controllers/SuperAdminController";
import { SubscriptionRepository } from "../infrastructure/repositories/SubscriptionRepository";
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";



export const superAdminDI=()=>{
    const repository = new SuperAdminRepository()
    const loginUseCase = new LoginUseCase(repository);
    const refreshTokenUseCase = new RefreshTokenUseCase()
const planPriceRepo = new PlanPriceRepostory()
const createPlanPrice =  new CreatePlanUseCase(planPriceRepo)
const updatePlan = new UpdatePlanUseCase(planPriceRepo);
const deletePlan = new DeletePlanUseCase(planPriceRepo)
const subscriptionRepo= new SubscriptionRepository()
const companyRepo= new companyRepository()
const ListCompanyPurchasedPlan = new ListCompanyPurchasedPlanUseCase(subscriptionRepo,companyRepo)
    const controller = new SuperAdminController(
        loginUseCase,
        refreshTokenUseCase,
        createPlanPrice,
        updatePlan,
        deletePlan,
        ListCompanyPurchasedPlan
    )


    return controller
}

