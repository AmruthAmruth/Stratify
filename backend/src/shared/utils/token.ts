import jwt from 'jsonwebtoken'


const ACCESS_TOKEN_EXPIRY = "7d";       
const REFRESH_TOKEN_EXPIRY = "30d"; 


export const generateAccessToken=(payload:object):string=>{
    return jwt.sign(payload,process.env.JWT_SECRET!,{expiresIn:ACCESS_TOKEN_EXPIRY})
}


export const generateRefreshToken=(payload:object):string=>{
    return jwt.sign(payload,process.env.JWT_SECRET!,{expiresIn:REFRESH_TOKEN_EXPIRY})
}


export const verifyToken = (token: string, secret: string): string | jwt.JwtPayload => {
    return jwt.verify(token, secret);
};