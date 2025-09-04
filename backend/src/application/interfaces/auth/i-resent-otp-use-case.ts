export interface IResendOtpUseCase {
  execute(email: string): Promise<void>;
}
