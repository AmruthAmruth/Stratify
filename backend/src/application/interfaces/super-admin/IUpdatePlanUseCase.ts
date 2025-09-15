


export interface IUpdatePlanUseCase{
    execute(plan: string, description: string, amount: number, durationInMonths: number):Promise<void>
}