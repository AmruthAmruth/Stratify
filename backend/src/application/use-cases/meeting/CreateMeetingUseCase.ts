import { Meeting } from "../../../domain/entities/Meeting";
import { Notification } from "../../../domain/entities/Notification";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { NotificationEmitter } from "../../../shared/events/NotificationEmitter";
import { ICreateMeetingUseCase } from "../../interfaces/meeting/ICreateMeetingUseCase";
import { randomUUID } from "crypto";

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


    const meeting = new Meeting(
      undefined,
      randomUUID(),
      creatorId,
      title,
      "open",
      undefined, // projectId - not set for manual meetings
      false, // isRecurring - manual meetings are not recurring
      undefined, // scheduledDate - not set for manual meetings
      new Date()
    );

    const createdMeeting = await this._meetingRepo.create(meeting);

    const manager = await this._managerRepo.findById(creatorId);
    if (!manager) throw new Error("Manager not found");

    const employees = await this._employeeRepo.findByDepartmentId(manager.departmentId!);
    if (!employees || employees.length === 0) return createdMeeting;

    for (const emp of employees) {
      const notification = new Notification(

        emp.id!,
        emp.role,
        "New Meeting Scheduled",
        `📅 A new meeting "${title}" has been created by ${manager.name}. Please check your meeting section for details.`,
        "info",
      );
      NotificationEmitter.emit(notification);
      await this._notificationRepo.create(notification);
    }

    return createdMeeting;
  }
}
