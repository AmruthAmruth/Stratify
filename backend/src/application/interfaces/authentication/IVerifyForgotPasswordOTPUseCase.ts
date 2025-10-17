export interface IVerifyForgotPasswordOTPUseCase {
  execute(
    email: string,
    otp: string,
  ): Promise<{ success: boolean; userName: string; role: string }>;
}
