
import { OTP } from "../entities/otp";

export interface IOTPRepository{
    save(otp:OTP):Promise<void>;
    findByEmail(email:string):Promise<OTP|null>;
    deleteByEmail(email:string):Promise<void>;
}

