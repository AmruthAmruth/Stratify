export interface ISendOTPUseCase {
  execute(email: string, userId?: string): Promise<Date>;
}
