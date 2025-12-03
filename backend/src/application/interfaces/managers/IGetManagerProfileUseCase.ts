import { ManagerProfileResponse } from "./types";

export interface IGetManagerProfileUseCase {
    execute(managerId: string): Promise<ManagerProfileResponse>;
}
