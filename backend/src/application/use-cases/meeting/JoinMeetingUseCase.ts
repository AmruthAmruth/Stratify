import { Meeting } from "../../../domain/entities/Meeting";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { IJoinMeetingUseCase } from "../../interfaces/meeting/IJoinMeetingUseCase";

export class JoinMeetingUseCase implements IJoinMeetingUseCase {
    constructor(
        private _meetingRepository: IMeetingRepository,
        private _projectRepository: IProjectRepository
    ) { }

    async execute(roomId: string, userId: string): Promise<Meeting> {
        const meeting = await this._meetingRepository.findByRoomId(roomId);
        if (!meeting) {
            throw new AppError("Meeting is not found", 404);
        }
        if (meeting.status === "closed") {
            throw new AppError("Meeting is Closed", 400);
        }

        if (meeting.projectId) {
            const project = await this._projectRepository.findById(meeting.projectId);
            if (!project) {
                throw new AppError("Associated project not found", 404);
            }

            const isTeamMember = project.teamMemberIds?.includes(userId);
            const isProjectLead = project.projectLeadId === userId;

            if (!isTeamMember && !isProjectLead) {
                throw new AppError("You are not authorized to join this meeting", 403);
            }
        }

        return meeting;
    }
}