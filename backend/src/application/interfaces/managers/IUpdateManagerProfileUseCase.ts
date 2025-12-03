import { UpdateManagerProfileData, UpdateManagerProfileResponse } from "./types";

export interface IUpdateManagerProfileUseCase {
    execute(managerId: string, data: UpdateManagerProfileData): Promise<UpdateManagerProfileResponse>;
}
