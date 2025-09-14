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
    const doc = await SubscriptionModel.findOne({ companyId, status: { $in: ["active", "trial"] } });
    if (!doc) return null;
    return new Subscription(doc.id, doc.companyId, doc.startDate, doc.endDate, doc.status as any, doc.plan, doc.amount, doc.paymentId);
  }


   async listByCompany(companyId: string): Promise<Subscription[]> {
    const docs = await SubscriptionModel.find({ companyId });
    return docs.map(doc => new Subscription(doc.id, doc.companyId, doc.startDate, doc.endDate, doc.status as any, doc.plan, doc.amount, doc.paymentId));
  }



  async markExpired(subscriptionId: string): Promise<void> {
    await SubscriptionModel.findByIdAndUpdate(subscriptionId, { status: "expired" });
  }



}
