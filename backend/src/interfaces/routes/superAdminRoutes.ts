import { Router } from "express";
import { SuperAdminController } from "../controllers/SuperAdminController";

const superAdminRouter= Router();

const controllers = new SuperAdminController()

superAdminRouter.post('/login',(req,res)=>controllers.login(req,res))

export default superAdminRouter;








 










