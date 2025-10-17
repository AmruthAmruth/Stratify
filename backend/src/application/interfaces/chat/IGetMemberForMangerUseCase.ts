import { GetMemberForMangerDTO } from "../../dto/chat/GetMemberForManagerDTO";

export interface IGetMemberForMangerUseCase {
  execute(managerId: string): Promise<GetMemberForMangerDTO>;
}
