import { LoginUseCase } from "../application/use-cases/super-admin/login-use-case"
import { RefreshTokenUseCase } from "../application/use-cases/super-admin/refreash-token-use-case";
import { SuperAdminRepository } from "../infrastructure/repositories/super-admin-repository"
import { SuperAdminController } from "../interfaces/controllers/super-admin-controller";



export const superAdminDI=()=>{
    const repository = new SuperAdminRepository()
    const loginUseCase = new LoginUseCase(repository);
    const refreshTokenUseCase = new RefreshTokenUseCase()

    const controller = new SuperAdminController(loginUseCase,refreshTokenUseCase)


    return controller
}

