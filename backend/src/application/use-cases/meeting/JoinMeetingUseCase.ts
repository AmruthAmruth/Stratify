import { Meeting } from "../../../domain/entities/Meeting";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { IJoinMeetingUseCase } from "../../interfaces/meeting/IJoinMeetingUseCase";

export class JoinMeetingUseCase implements IJoinMeetingUseCase {
    constructor(
        private _meetingRepository: IMeetingRepository,
        private _projectRepository: IProjectRepository
    ) { }

    async execute(roomId: string, userId: string): Promise<Meeting> {
        const meeting = await this._meetingRepository.findByRoomId(roomId);
        if (!meeting) {
            throw new AppError(Messages.MEETING_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        if (meeting.status === "closed") {
            throw new AppError(Messages.MEETING_CLOSED, StatusCodes.BAD_REQUEST);
        }

        if (meeting.projectId) {
            const project = await this._projectRepository.findById(meeting.projectId);
            if (!project) {
                throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
            }

            const isTeamMember = project.teamMemberIds?.includes(userId);
            const isProjectLead = project.projectLeadId === userId;

            if (!isTeamMember && !isProjectLead) {
                throw new AppError(Messages.MEETING_JOIN_RESTRICTED, StatusCodes.FORBIDDEN);
            }
        }

        return meeting;
    }
}