
import { PlanPrice } from "../../domain/entities/PlanPrice";
import { IPlanPriceRepository } from "../../domain/repositories/IPlanPriceRepository";
import PlanPriceModel from "../models/PlanPriceModel";



export class PlanPriceRepostory implements IPlanPriceRepository{
   
async getPlan(plan: string): Promise<PlanPrice | null> {
    const doc = await PlanPriceModel.findOne({ plan });
    if (!doc) return null;
    return new PlanPrice(doc.plan, doc.amount, doc.durationInMonths);
}


 async setPlan(plan: string, amount: number, durationInMonths: number): Promise<void> {
    await PlanPriceModel.findOneAndUpdate(
      { plan }, 
      { amount, durationInMonths }, 
      { upsert: true, new: true } 
    );
  }

 async listPlans(): Promise<PlanPrice[]> {
    const docs = await PlanPriceModel.find();
    return docs.map(doc => new PlanPrice(doc.plan, doc.amount, doc.durationInMonths));
  }

}