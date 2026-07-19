import { UserCompanyInfoResponseDTO } from "../../dto/company/UserCompanyInfoResponseDTO";

export interface IGetUserCompanyInfoUseCase {
    execute(userId: string, role: string): Promise<UserCompanyInfoResponseDTO>;
}
