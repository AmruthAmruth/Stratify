export interface IVerifyCompanyOTPUseCase {
  execute(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string }>;
}