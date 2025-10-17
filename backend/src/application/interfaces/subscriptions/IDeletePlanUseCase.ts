export interface IDeletePlanUseCase {
  execute(plan: string): Promise<void>;
}
