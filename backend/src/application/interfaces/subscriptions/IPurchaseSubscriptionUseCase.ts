import { Subscription } from "../../../domain/entities/Subscription";
import { PurchaseSubscriptionResponseDTO } from "../../dto/subscriptions/PurchaseSubscriptionResponseDTO";

export interface IPurchaseSubscriptionUseCase {
  execute(
    planName: string,
    companyId: string,
  ): Promise<PurchaseSubscriptionResponseDTO>;

  verifyAndActivate(
    companyId: string,
    planName: string,
    orderId: string,
    paymentId: string,
    signature: string,
  ): Promise<Subscription>;
}
