import { Manager } from "../../../domain/entities/manager";
import { IGetManagerByCompanyIdUseCase } from "../interfaces/company/i-get-manager-by-company-id-use-case";



export class GetManagerByCompanyIdUseCase {
    constructor(
        private _IGetManagerByCompanyIdUseCase: IGetManagerByCompanyIdUseCase
    ){}

    async execute(companyId:string):Promise<Manager|null>{
        return await this._IGetManagerByCompanyIdUseCase.execute(companyId)
    }
}