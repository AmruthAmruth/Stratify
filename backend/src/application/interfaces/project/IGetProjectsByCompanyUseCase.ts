import { GetProjectsByCompanyResponse } from "../../dto/project/GetProjectsByCompanyDTO";




export interface IGetProjectsByCompanyUseCase{
    execute(companyId:string):Promise<GetProjectsByCompanyResponse>
}