import { VerifyForgotPasswordResponseDTO } from "../../dto/authentication/VerifyForgotPasswordResponseDTO";

export interface IVerifyForgotPasswordOTPUseCase {
  execute(email: string, otp: string): Promise<VerifyForgotPasswordResponseDTO>;
}
