import { Manager } from "../../../domain/entities/Manager";
import { IGetManagerByCompanyIdUseCase } from "../../interfaces/company/IGetManagerByCompanyIdUseCase";



export class GetManagerByCompanyIdUseCase {
    constructor(
        private _IGetManagerByCompanyIdUseCase: IGetManagerByCompanyIdUseCase
    ){}

    async execute(companyId:string):Promise<Manager|null>{
        return await this._IGetManagerByCompanyIdUseCase.execute(companyId)
    }
}