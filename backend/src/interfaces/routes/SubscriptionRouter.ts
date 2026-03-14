import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { subscriptionDI } from "../../di/SubscriptionDI";
import { validateRequest } from "../middleware/ValidationMiddleware";
import { CreatePlanSchema } from "../../application/validators/CreatePlan";
import {
  PurchasePlanSchema,
  VerifyPaymentSchema,
  PurchasePlanUnauthenticatedSchema,
  VerifyPaymentUnauthenticatedSchema,
  UpdatePlanSchema,
  DeletePlanSchema,
} from "../../application/validators/SubscriptionValidator";

const subscriptionRouter = Router();
const controller = subscriptionDI();

subscriptionRouter.get(
  "/subscription-plans",
  asyncHandler(controller.listPlans),
);
subscriptionRouter.post(
  "/purchase",
  authMiddleware(["company"]),
  validateRequest(PurchasePlanSchema),
  asyncHandler(controller.purchasePlan),
);
subscriptionRouter.post(
  "/verify-payment",
  authMiddleware(["company"]),
  validateRequest(VerifyPaymentSchema),
  asyncHandler(controller.verifyPayment),
);
subscriptionRouter.post(
  "/purchase-unauthenticated",
  validateRequest(PurchasePlanUnauthenticatedSchema),
  asyncHandler(controller.purchasePlanForUnauthenticated),
);
subscriptionRouter.post(
  "/verify-payment-unauthorized",
  validateRequest(VerifyPaymentUnauthenticatedSchema),
  asyncHandler(controller.verifyPaymentForUnauthenticated),
);
subscriptionRouter.post("/create-plan", validateRequest(CreatePlanSchema), asyncHandler(controller.createPlan));
subscriptionRouter.put("/update-plan", validateRequest(UpdatePlanSchema), asyncHandler(controller.updatePlan));
subscriptionRouter.delete("/delete-plan", validateRequest(DeletePlanSchema), asyncHandler(controller.deletePlan));
subscriptionRouter.get(
  "/list-purchased-company",
  asyncHandler(controller.listPurchasedPlan),
);

subscriptionRouter.get(
  "/dashboard-stats",
  asyncHandler(controller.getDashboardStats),
);

export default subscriptionRouter;
