import { Meeting } from "../../domain/entities/Meeting";

export class MeetingMapper {

    static toDomain(
        creatorId: string,
        title: string,
        roomId: string,
        projectId?: string,
        isRecurring: boolean = false,
        scheduledDate?: Date,
    ): Meeting {
        return new Meeting(
            undefined,
            roomId,
            creatorId,
            title,
            "open",
            projectId,
            isRecurring,
            scheduledDate,
            new Date()
        );
    }

    static toResponse(meeting: Meeting) {
        return {
            id: meeting.id,
            roomId: meeting.roomId,
            creatorId: meeting.creatorId,
            title: meeting.title,
            status: meeting.status,
            projectId: meeting.projectId,
            isRecurring: meeting.isRecurring,
            scheduledDate: meeting.scheduledDate,
            createdAt: meeting.createdAt,
        };
    }

    static toListResponse(meetings: Meeting[]) {
        return meetings.map((meeting) => this.toResponse(meeting));
    }
}
