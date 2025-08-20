import { Router } from "express";
import { companyDI } from "../../di/companyDI";
import { upload } from "../../shared/utils/cloudinaryConfig";


const companyRouter = Router();
const controller = companyDI();


companyRouter.post("/register", upload.single("profileImage"), controller.register);
companyRouter.post("/verify-otp", controller.verifyOTP);
companyRouter.get("/all-company", controller.getAllCompanies);
companyRouter.get("/:id", controller.getCompanyById);
companyRouter.post("/login", controller.login);

export default companyRouter
