import { Subscription } from "../../../domain/entities/Subscription";
import { ISubscriptionRepository } from "../../../domain/repositories/ISubscriptionRepository";
import { generateRandomPassword } from "../../../shared/utils/password";
import { ICreateTrialSubscriptionUseCase } from "../../interfaces/subscriptions/ICreateTrialSubscriptionUseCase";

export class CreateTrialSubscriptionUseCase
  implements ICreateTrialSubscriptionUseCase
{
  constructor(private _subscriptionRepo: ISubscriptionRepository) {}
  async execute(companyId: string): Promise<Subscription> {
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = new Subscription(
      generateRandomPassword(),
      companyId,
      now,
      endDate,
      "trial",
      "trial",
      0,
    );

    return await this._subscriptionRepo.create(subscription);
  }
}
