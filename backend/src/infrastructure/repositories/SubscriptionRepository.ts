import { Subscription } from "../../domain/entities/Subscription";
import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import SubscriptionModel from "../models/SubscriptionModel";

export class SubscriptionRepository implements ISubscriptionRepository {
  
  
    async create(subscription: Subscription): Promise<Subscription> {
    const doc = new SubscriptionModel(subscription);
    await doc.save();
    return subscription;
  }


 async getActiveByCompany(companyId: string): Promise<Subscription | null> {
    const doc = await SubscriptionModel.findOne({
      companyId,
      status: { $in: ["active", "trial"] },
    });
    if (!doc) return null;

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

   async listByCompany(companyId: string): Promise<Subscription[]> {
    const docs = await SubscriptionModel.find({ companyId });
    return docs.map(
      (doc) =>
        new Subscription(
          doc.id,
          doc.companyId,
          doc.startDate,
          doc.endDate,
          doc.status as "active" | "expired" | "trial" | "cancelled",
          doc.plan,
          doc.amount,
          doc.paymentId
        )
    );
  }



  async markExpired(subscriptionId: string): Promise<void> {
    await SubscriptionModel.findByIdAndUpdate(subscriptionId, { status: "expired" });
  }


  async updatePlan(subscription: Subscription): Promise<Subscription> {
  
  const updatedDoc = await SubscriptionModel.findByIdAndUpdate(
    subscription.id, 
    {
      plan: subscription.plan,
      amount: subscription.amount,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
      paymentId: subscription.paymentId,
    },
    { new: true }
  );

  if (!updatedDoc) {
    throw new Error("Subscription not found");
  }
  return new Subscription(
    updatedDoc.id,
    updatedDoc.companyId,
    updatedDoc.startDate,
    updatedDoc.endDate,
    updatedDoc.status as "active" | "expired" | "trial" | "cancelled",
    updatedDoc.plan,
    updatedDoc.amount,
    updatedDoc.paymentId
  );
}


async deletePlan(plan: string): Promise<void> {
   await SubscriptionModel.deleteOne({ plan });
}


  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    const doc = await SubscriptionModel.findOne({ companyId });
    if (!doc) return null;

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
}
