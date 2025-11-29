import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { NotificationEmitter } from "../../../shared/events/NotificationEmitter";
import { Messages } from "../../../shared/constants/messages";
import { ICreateMeetingUseCase } from "../../interfaces/meeting/ICreateMeetingUseCase";
import { randomUUID } from "crypto";
import { MeetingMapper } from "../../mappers/MeetingMapper";
import { Meeting } from "../../../domain/entities/Meeting";
import { NotificationMapper } from "../../mappers/NotificationMapper";

export class CreateMeetingUseCase implements ICreateMeetingUseCase {
  constructor(
    private _meetingRepo: IMeetingRepository,
    private _notificationRepo: INotificationRepository,
    private _employeeRepo: IEmployeeRepository,
    private _managerRepo: IManagerRepository
  ) { }

  async execute(creatorId: string, title: string): Promise<Meeting> {


    const existingMeeting = await this._meetingRepo.findByTitle(title);
    if (existingMeeting) {
      throw new AppError(`A meeting with the title "${title}" already exists.`)
    }

    const meeting = MeetingMapper.toDomain(creatorId, title, randomUUID());

    const createdMeeting = await this._meetingRepo.create(meeting);

    const manager = await this._managerRepo.findById(creatorId);
    if (!manager) throw new Error(Messages.MANAGER_NOT_FOUND);

    const employees = await this._employeeRepo.findByDepartmentId(manager.departmentId!);
    if (!employees || employees.length === 0) return createdMeeting;

    for (const emp of employees) {
      const notification = NotificationMapper.toDomain({
        userId: emp.id!,
        role: emp.role.charAt(0).toUpperCase() + emp.role.slice(1) as "Company" | "Manager" | "Employee",
        title: "New Meeting Scheduled",
        message: `📅 A new meeting "${title}" has been created by ${manager.name}. Please check your meeting section for details.`,
        type: "info"
      });
      NotificationEmitter.emit(notification);
      await this._notificationRepo.create(notification);
    }

    return createdMeeting;
  }
}
