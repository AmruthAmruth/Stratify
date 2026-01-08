export interface IVerifyCompanyOTPUseCase {
  execute(
    email: string,
    otp: string,
  ): Promise<void>;
}
