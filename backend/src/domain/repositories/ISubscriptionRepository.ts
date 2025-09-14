import { Subscription } from "../entities/Subscription";



export interface ISubscriptionRepository {
  create(subscription: Subscription): Promise<Subscription>;
  getActiveByCompany(companyId: string): Promise<Subscription | null>;
  listByCompany(companyId: string): Promise<Subscription[]>;
  markExpired(subscriptionId: string): Promise<void>;
}