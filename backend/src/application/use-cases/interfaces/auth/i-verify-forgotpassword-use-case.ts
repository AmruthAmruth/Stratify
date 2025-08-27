export interface IVerifyForgotPasswordOTPUseCase {
  execute(email: string, otp: string): Promise<{success: boolean,companyName:string}>;
}
