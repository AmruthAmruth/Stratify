import { ProfileDTO } from "../../dto/company/ProfileDTO";

export interface IGetProfileUseCase {
  execute(id: string): Promise<ProfileDTO | null>;
}
