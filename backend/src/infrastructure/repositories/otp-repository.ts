import { OTP } from "../../domain/entities/otp";
import OTPModel from "../models/otp-model";
import { IOTPRepository } from "../../domain/repositories/i-otp-repository";

export class OTPRepository implements IOTPRepository{
    async save(otp: OTP): Promise<void> {
        await OTPModel.create(otp)
    }


    async findByEmail(email: string): Promise<OTP | null> {
        const otpDoc= await OTPModel.findOne({email})
        if(!otpDoc) return null;
        return new OTP(otpDoc.email,otpDoc.code,otpDoc.expiresAt)
    }

    async deleteByEmail(email: string): Promise<void> {
        await OTPModel.deleteOne({email})
    }

}