import { LoginDTO } from "../../../validators/login-validator";


export interface ILoginUseCase{
    execute(data:LoginDTO):Promise<{accessToken:string,refreshToken:string}>;
}