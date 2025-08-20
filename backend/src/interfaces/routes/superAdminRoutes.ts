

import { Router } from "express";
import { superAdminDI } from "../../di/superAdminDI";


const superAdminRouter = Router();

const controllers = superAdminDI();

superAdminRouter.post('/login',(req,res)=>controllers.login(req,res))
superAdminRouter.post('/refresh',(req,res)=>controllers.refresh(req,res))

export default superAdminRouter