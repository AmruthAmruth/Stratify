export class Subscription {
  constructor(
    public id: string,
    public companyId: string,
    public startDate: Date,
    public endDate: Date,
    public status: "active" | "expired" | "trial" | "cancelled",
    public plan: string,  
    public amount: number,
    public paymentId?: string
  ) {}
}