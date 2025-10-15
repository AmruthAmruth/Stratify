import { GetMemberForCompanyDTO } from "../../dto/chat/GetMemberForCompanyDTO";


export interface IGetMemberForCompanyUseCase{
    execute(companyId:string):Promise<GetMemberForCompanyDTO>
}