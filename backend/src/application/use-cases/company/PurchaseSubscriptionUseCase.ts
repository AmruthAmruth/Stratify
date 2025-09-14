import { createHmac } from "crypto";
import { Subscription } from "../../../domain/entities/Subscription";
import { IPlanPriceRepository } from "../../../domain/repositories/IPlanPriceRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/ISubscriptionRepository";
import { RazorpayService } from "../../../infrastructure/services/RazorpayService";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { generateRandomPassword } from "../../../shared/utils/password";
import { IPurchaseSubscriptionUseCase } from "../../interfaces/company/IPurchaseSubscriptionUseCase";

export class PurchaseSubscriptionUseCase implements IPurchaseSubscriptionUseCase { 
  constructor(
    private _subscriptionRepo: ISubscriptionRepository,
    private _planRepo: IPlanPriceRepository,
    private _razorpay: RazorpayService
  ) {}

  
  async execute( planName: string) {
    const plan = await this._planRepo.getPlan(planName);
    if (!plan) throw new AppError("Plan not found");

    const order = await this._razorpay.createOrder(plan.amount);

    return {
      orderId: order.id,
     amount: Number(order.amount),
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      planName: plan.plan,
    };
  }

 
  async verifyAndActivate(
    companyId: string,
    planName: string,
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<Subscription> {
    const plan = await this._planRepo.getPlan(planName);
    if (!plan) throw new AppError("Plan not found");

   
    const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + "|" + paymentId)
      .digest("hex");


    if (expectedSignature !== signature) {
      throw new AppError("Payment verification failed");
    }


    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

    const subscription = new Subscription(
      generateRandomPassword(), 
      companyId,
      now,
      endDate,
      "active",
      plan.plan,
      plan.amount,
      paymentId
    );

    return await this._subscriptionRepo.create(subscription);
  }
}
