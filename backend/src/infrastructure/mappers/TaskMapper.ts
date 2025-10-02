import { HydratedDocument, Types } from "mongoose";
import { TaskDocument } from "../models/TaskModel";
import { Task } from "../../domain/entities/Task";

export class TaskMapper {
 
  static toEntity(doc: HydratedDocument<TaskDocument>): Task {
    return new Task(
      doc.id.toString(),
      doc.userStoryId.toString(),
      doc.title,
      doc.description,
      doc.status,
      doc.assignedToId?.toString(),
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toDocument(task: Task) {
    return {
      userStoryId: new Types.ObjectId(task.userStoryId),
      title: task.title,
      description: task.description,
      status: task.status ?? "To Do",
      assignedToId: task.assignedToId ? new Types.ObjectId(task.assignedToId) : undefined,
    };
  }
}
