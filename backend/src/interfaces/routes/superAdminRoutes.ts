import { Router } from "express";
import { SuperAdminController } from "../controllers/SuperAdminController";
import { SuperAdminRepository } from "../../infrastructure/repositories/SuperAdminRepository";
import { LoginUseCase } from "../../application/use-cases/super-admin/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/super-admin/RefreshTokenUseCase";

const superAdminRouter= Router();


const repository = new SuperAdminRepository();
const loginUseCase = new LoginUseCase(repository);
const refreshTokenUseCase = new RefreshTokenUseCase()

const controllers = new SuperAdminController(loginUseCase,refreshTokenUseCase)

superAdminRouter.post('/login',(req,res)=>controllers.login(req,res))
superAdminRouter.post('/refresh',(req,res)=>controllers.refresh(req,res))
export default superAdminRouter;








 










