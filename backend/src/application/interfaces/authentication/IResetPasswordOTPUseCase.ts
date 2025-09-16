export interface IResetPasswordUseCase {
  execute(email: string, password: string): Promise<boolean>;
}
