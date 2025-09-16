import { Subscription } from "../../../domain/entities/Subscription";


export interface IVerifySubscriptionUseCase{
    execute(   companyId: string,
    planName: string,
    orderId: string,
    paymentId: string,
    signature: string):Promise<Subscription>
}