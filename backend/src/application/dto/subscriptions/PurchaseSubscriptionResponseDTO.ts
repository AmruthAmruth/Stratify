export interface PurchaseSubscriptionResponseDTO {
  orderId: string;
  amount: number;
  currency: string;
  key: string | undefined;
  planName: string;
}
