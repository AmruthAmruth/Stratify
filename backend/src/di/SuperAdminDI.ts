import { CreatePlanUseCase } from "../application/use-cases/super-admin/CreatePlanUseCase";
import { LoginUseCase } from "../application/use-cases/super-admin/LoginUseCase"
import { RefreshTokenUseCase } from "../application/use-cases/super-admin/RefreashTokenUseCase";
import { PlanPriceRepostory } from "../infrastructure/repositories/PlanPriceRepository";
import { SuperAdminRepository } from "../infrastructure/repositories/SuperAdminRepository"
import { SuperAdminController } from "../interfaces/controllers/SuperAdminController";



export const superAdminDI=()=>{
    const repository = new SuperAdminRepository()
    const loginUseCase = new LoginUseCase(repository);
    const refreshTokenUseCase = new RefreshTokenUseCase()
const planPriceRepo = new PlanPriceRepostory()
const createPlanPrice =  new CreatePlanUseCase(planPriceRepo)


    const controller = new SuperAdminController(loginUseCase,refreshTokenUseCase,createPlanPrice)


    return controller
}

