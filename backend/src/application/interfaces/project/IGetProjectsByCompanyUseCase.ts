import { GetProjectsByCompanyDTO } from "../../dto/project/GetProjectsByCompanyDTO";



export interface IGetProjectsByCompanyUseCase{
    execute(companyId:string):Promise<GetProjectsByCompanyDTO[]>
}