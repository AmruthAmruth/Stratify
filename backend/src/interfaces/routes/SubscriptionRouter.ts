import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { subscriptionDI } from "../../di/SubscriptionDI";

const subscriptionRouter = Router();
const controller = subscriptionDI();

subscriptionRouter.get("/subscription-plans", asyncHandler(controller.listPlans));
subscriptionRouter.post("/purchase", authMiddleware(["company"]), asyncHandler(controller.purchasePlan));
subscriptionRouter.post("/verify-payment", authMiddleware(["company"]), asyncHandler(controller.verifyPayment));
subscriptionRouter.post("/purchase-unauthenticated", asyncHandler(controller.purchasePlanForUnauthenticated));
subscriptionRouter.post("/verify-payment-unauthorized", asyncHandler(controller.verifyPaymentForUnauthenticated));
subscriptionRouter.post("/create-plan",asyncHandler(controller.createPlan));
subscriptionRouter.put("/update-plan",asyncHandler(controller.updatePlan));
subscriptionRouter.delete("/delete-plan",asyncHandler(controller.deletePlan));
subscriptionRouter.get("/list-purchased-company",asyncHandler(controller.listPurchasedPlan))
export default subscriptionRouter;