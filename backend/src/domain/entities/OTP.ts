

export class OTP{
    constructor(
        public email:string,
        public code:string,
        public expiresAt:Date
    ){}

    isExpired():boolean{
        return new Date()>this.expiresAt
    }
}









 



















