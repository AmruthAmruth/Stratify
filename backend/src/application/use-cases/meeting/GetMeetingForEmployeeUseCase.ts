import { Meeting } from "../../../domain/entities/Meeting";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IGetMeetingsForEmployeeUseCase } from "../../interfaces/meeting/IGetMeetingForEmployeeUseCase";



export class GetMeetingForEmployeeUseCase implements IGetMeetingsForEmployeeUseCase {
    constructor(
        private _meetingRepo: IMeetingRepository,
        private _employeeRepo: IEmployeeRepository,
        private _projectRepo: IProjectRepository
    ) { }

    async execute(employeeId: string): Promise<Meeting[]> {
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) return [];

        const meetings: Meeting[] = [];

        if (employee.managerId) {
            const departmentMeetings = await this._meetingRepo.findMeetingByCreatorId(employee.managerId);
            meetings.push(...departmentMeetings);
        }

        const projects = await this._projectRepo.findByTeamMemberId(employeeId);

        for (const project of projects) {
            if (project.id) {
                const projectMeetings = await this._meetingRepo.findByProjectId(project.id);
                meetings.push(...projectMeetings);
            }
        }

        const uniqueMeetings = Array.from(new Map(meetings.map(m => [m.roomId, m])).values());

        return uniqueMeetings.sort((a, b) => {
            const dateA = a.scheduledDate || a.createdAt;
            const dateB = b.scheduledDate || b.createdAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
    }
}