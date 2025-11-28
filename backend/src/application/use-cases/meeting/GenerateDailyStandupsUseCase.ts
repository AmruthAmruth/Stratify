import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { Meeting } from "../../../domain/entities/Meeting";
import { Notification } from "../../../domain/entities/Notification";
import { randomUUID } from "crypto";
import { NotificationEmitter } from "../../../shared/events/NotificationEmitter";

export class GenerateDailyStandupsUseCase {
    constructor(
        private _meetingRepo: IMeetingRepository,
        private _projectRepo: IProjectRepository,
        private _notificationRepo: INotificationRepository
    ) { }

    async execute(): Promise<void> {
        console.log("🔄 Starting daily standup generation...");
        const activeProjects = await this._projectRepo.findActiveProjects();

        if (activeProjects.length === 0) {
            console.log("ℹ️ No active projects found for daily standups.");
            return;
        }

        const today = new Date();
        today.setHours(10, 0, 0, 0); 

        const dateStr = today.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        let meetingsCreated = 0;

        for (const project of activeProjects) {
           
            const start = new Date(project.startDate);
            const end = new Date(project.endDate);
            const now = new Date();

           
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            now.setHours(0, 0, 0, 0);

            if (now < start || now > end) {
                continue;
            }

         

            const meeting = new Meeting(
                undefined,
                randomUUID(),
                project.projectLeadId,
                `${project.name} - Daily Standup - ${dateStr}`,
                "open",
                project.id,
                true,
                today,
                new Date()
            );

            await this._meetingRepo.create(meeting);
            meetingsCreated++;

            if (project.teamMemberIds && project.teamMemberIds.length > 0) {
                for (const memberId of project.teamMemberIds) {
                    const notification = new Notification(
                        memberId,
                        "employee",
                        "Daily Standup Scheduled",
                        `📅 Your daily standup for "${project.name}" is scheduled for today at 10:00 AM.`,
                        "info"
                    );

                    NotificationEmitter.emit(notification);
                    await this._notificationRepo.create(notification);
                }
            }
        }

        console.log(`✅ Generated ${meetingsCreated} daily standups for ${activeProjects.length} active projects.`);
    }
}
