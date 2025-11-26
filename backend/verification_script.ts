import mongoose from 'mongoose';
import { GenerateDailyStandupsUseCase } from './src/application/use-cases/meeting/GenerateDailyStandupsUseCase';
import { MeetingRepository } from './src/infrastructure/repositories/MeetingRepository';
import { ProjectRepository } from './src/infrastructure/repositories/ProjectRepository';
import { NotificationRepository } from './src/infrastructure/repositories/NotificationRepository';
import { SocketService } from './src/shared/services/SocketService';
import dotenv from 'dotenv';

dotenv.config();

async function verify() {
    try {
        console.log("Connecting to DB...");
        // @ts-ignore
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to DB");

        // Mock SocketService
        SocketService.setIO({
            to: (id: string) => ({
                emit: (event: string, data: any) => console.log(`[MockSocket] Emit to ${id}: ${event}`, data)
            })
        } as any);

        const useCase = new GenerateDailyStandupsUseCase(
            new MeetingRepository(),
            new ProjectRepository(),
            new NotificationRepository()
        );

        await useCase.execute();
        console.log("Verification complete");
    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

verify();
