import { LoginUseCase } from "../application/use-cases/super-admin/LoginUseCase"
import { RefreshTokenUseCase } from "../application/use-cases/super-admin/RefreshTokenUseCase";
import { SuperAdminRepository } from "../infrastructure/repositories/SuperAdminRepository"
import { SuperAdminController } from "../interfaces/controllers/SuperAdminController";



export const superAdminDI=()=>{
    const repository = new SuperAdminRepository()
    const loginUseCase = new LoginUseCase(repository);
    const refreshTokenUseCase = new RefreshTokenUseCase()

    const controller = new SuperAdminController(loginUseCase,refreshTokenUseCase)


    return controller
}

