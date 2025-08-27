import { LoginDTO } from "../../dto/auth/LoginSchema";


export interface ILoginUseCase{
    execute(data:LoginDTO):Promise<{accessToken:string,refreshToken:string}>;
}