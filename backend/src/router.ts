import { Router } from "express";
import authRouter from "./interfaces/routes/AuthRouter";
import companyRouter from "./interfaces/routes/CompanyRoutes";
import departmentRouter from "./interfaces/routes/DepartmentRoutes";
import employeeRouter from "./interfaces/routes/EmployeeRoutes";
import subscriptionRouter from "./interfaces/routes/SubscriptionRouter";
import projectRouter from "./interfaces/routes/ProjectRouter";
import leaveRouter from "./interfaces/routes/LeaveRoues";
import notificationRouter from "./interfaces/routes/NotificationRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/company", companyRouter);
router.use("/department", departmentRouter);
router.use("/employee", employeeRouter);
router.use("/subscription", subscriptionRouter);
router.use("/project", projectRouter);
router.use("/leave", leaveRouter);
router.use("/notification",notificationRouter);
export default router;
