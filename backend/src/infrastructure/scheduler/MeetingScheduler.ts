import cron from 'node-cron';
import { GenerateDailyStandupsUseCase } from '../../application/use-cases/meeting/GenerateDailyStandupsUseCase';
import { MeetingRepository } from '../repositories/MeetingRepository';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';

export class MeetingScheduler {
    private _generateDailyStandupsUseCase: GenerateDailyStandupsUseCase;

    constructor() {
        const meetingRepo = new MeetingRepository();
        const projectRepo = new ProjectRepository();
        const notificationRepo = new NotificationRepository();

        this._generateDailyStandupsUseCase = new GenerateDailyStandupsUseCase(
            meetingRepo,
            projectRepo,
            notificationRepo
        ); 
    }

    public start(): void {
        console.log('⏳ Initializing Meeting Scheduler...');

        cron.schedule('0 0 * * *', async () => {
            console.log('⏰ Running Daily Standup Scheduler...');
            try {
                await this._generateDailyStandupsUseCase.execute();
            } catch (error) {
                console.error('❌ Error in Daily Standup Scheduler:', error);
            }
        });

        console.log('✅ Meeting Scheduler is running (00:00 Daily).');
    }
}
