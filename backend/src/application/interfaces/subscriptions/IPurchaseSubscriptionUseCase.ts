import { Subscription } from "../../../domain/entities/Subscription";

export interface IPurchaseSubscriptionUseCase {
  execute(
    planName: string,
    companyId: string,
  ): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    key: string | undefined;
    planName: string;
  }>;

  verifyAndActivate(
    companyId: string,
    planName: string,
    orderId: string,
    paymentId: string,
    signature: string,
  ): Promise<Subscription>;
}
