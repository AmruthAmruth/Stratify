export interface IForgotPasswordUseCase {
  execute(email: string): Promise<Date>;
}