export class PlanPrice {
  constructor(
    public plan: string,
    public description: string,
    public amount: number,
    public durationInMonths: number,
  ) {}
}
