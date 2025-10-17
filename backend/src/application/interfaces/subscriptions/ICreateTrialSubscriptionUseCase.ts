import { Subscription } from "../../../domain/entities/Subscription";

export interface ICreateTrialSubscriptionUseCase {
  execute(companyId: string): Promise<Subscription>;
}
