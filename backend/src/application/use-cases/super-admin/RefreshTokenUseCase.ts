import { verifyRefreshToken,TokenPayload,generateAccessToken,generateRefreshToken } from "../../../shared/utils/token";


export class RefreshTokenUseCase{
    async execute(refreshToken:string):Promise<{accessToken:string,refreshToken:string}>{
        try{
            const decoded = verifyRefreshToken(refreshToken) as TokenPayload;
            const payload: TokenPayload = { id: decoded.id, role: decoded.role };
            const accessToken = generateAccessToken(payload);
            const newRefreashToken= generateRefreshToken(payload);
            return {accessToken,refreshToken:newRefreashToken}

        }catch(err){
            throw new Error("Invalid or expired refresh token")
        }
    }
} 

  


















