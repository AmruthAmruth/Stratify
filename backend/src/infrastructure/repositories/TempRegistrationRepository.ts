import { ITempRegistrationRepository } from "../../domain/repositories/ITempRegistrationRepository";


export class TempRegistrationRepository implements ITempRegistrationRepository{
    private storage=new Map<string,{data:any;expiresAt: Date }>();
    async save(email: string, data: any, expiresAt: Date): Promise<void> {
        this.storage.set(email,{data,expiresAt})
    }

    async findByEmail(email: string): Promise<any | null> {
        const record = this.storage.get(email);
        if(!record) return null;
        if(record.expiresAt<new Date()){
            this.storage.delete(email);
            return null;
        }
        return record.data;
    }

    async delete(email: string): Promise<void> {
        this.storage.delete(email)
    }
}