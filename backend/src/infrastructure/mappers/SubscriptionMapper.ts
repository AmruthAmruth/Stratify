import { SubscriptionDocument } from "../models/SubscriptionModel";
import { Subscription } from "../../domain/entities/Subscription";

export class SubscriptionMapper {
  static toEntity(doc: SubscriptionDocument): Subscription {
    return new Subscription(
      doc.id,
      doc.companyId,
      doc.startDate,
      doc.endDate,
      doc.status as "active" | "expired" | "trial" | "cancelled",
      doc.plan,
      doc.amount,
      doc.paymentId
    );
  }

  static toDocument(subscription: Subscription) {
    return {
      companyId: subscription.companyId,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
      plan: subscription.plan,
      amount: subscription.amount,
      paymentId: subscription.paymentId,
    };
  }
}
