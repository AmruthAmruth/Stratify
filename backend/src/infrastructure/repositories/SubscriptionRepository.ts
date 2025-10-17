import { Subscription } from "../../domain/entities/Subscription";
import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import SubscriptionModel from "../models/SubscriptionModel";
import { SubscriptionMapper } from "../mappers/SubscriptionMapper";

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(subscription: Subscription): Promise<Subscription> {
    const doc = new SubscriptionModel(
      SubscriptionMapper.toDocument(subscription),
    );
    await doc.save();
    return SubscriptionMapper.toEntity(doc);
  }

  async getActiveByCompany(companyId: string): Promise<Subscription | null> {
    const doc = await SubscriptionModel.findOne({
      companyId,
      status: { $in: ["active", "trial"] },
    });
    return doc ? SubscriptionMapper.toEntity(doc) : null;
  }

  async listByCompany(companyId: string): Promise<Subscription[]> {
    const docs = await SubscriptionModel.find({ companyId });
    return docs.map(SubscriptionMapper.toEntity);
  }

  async markExpired(subscriptionId: string): Promise<void> {
    await SubscriptionModel.findByIdAndUpdate(subscriptionId, {
      status: "expired",
    });
  }

  async updatePlan(subscription: Subscription): Promise<Subscription> {
    const updatedDoc = await SubscriptionModel.findByIdAndUpdate(
      subscription.id,
      SubscriptionMapper.toDocument(subscription),
      { new: true },
    );

    if (!updatedDoc) throw new Error("Subscription not found");

    return SubscriptionMapper.toEntity(updatedDoc);
  }

  async deletePlan(plan: string): Promise<void> {
    await SubscriptionModel.deleteOne({ plan });
  }

  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    const doc = await SubscriptionModel.findOne({ companyId });
    return doc ? SubscriptionMapper.toEntity(doc) : null;
  }

  async listAllPlan(): Promise<Subscription[]> {
    const docs = await SubscriptionModel.find();
    return docs.map(SubscriptionMapper.toEntity);
  }
}
