import cron from 'node-cron';
import { GenerateDailyStandupsUseCase } from '../../application/use-cases/meeting/GenerateDailyStandupsUseCase';
import { IMeetingRepository } from '../../domain/repositories/IMeetingRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';

export class MeetingScheduler {
    private _generateDailyStandupsUseCase: GenerateDailyStandupsUseCase;

    constructor(
        meetingRepo: IMeetingRepository,
        projectRepo: IProjectRepository,
        notificationRepo: INotificationRepository
    ) {
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

        console.log('✅ Meeting Scheduler is running (12:00 Daily).');
    }
}
