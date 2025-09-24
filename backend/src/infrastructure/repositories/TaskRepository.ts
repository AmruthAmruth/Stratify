import { Types } from "mongoose";
import { Task } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { TaskModel } from "../models/TaskModel";

export class TaskRepository implements ITaskRepository {
  async create(task: Task): Promise<Task> {
    
    const created = await new TaskModel({
      userStoryId: new Types.ObjectId(task.userStoryId),
      title: task.title,
      description: task.description,
      status: task.status ?? "To Do",
      assignedToId: task.assignedToId ? new Types.ObjectId(task.assignedToId) : undefined,
    }).save();

    return new Task(
      created.id.toString(),
      created.userStoryId.toString(),
      created.title,
      created.description,
      created.status,
      created.assignedToId?.toString(),
      created.createdAt,
      created.updatedAt
    );
  }

  async update(task: Task): Promise<Task> {
    const updated = await TaskModel.findByIdAndUpdate(
      new Types.ObjectId(task.id),
      {
        title: task.title,
        description: task.description,
        status: task.status,
        assignedToId: task.assignedToId ? new Types.ObjectId(task.assignedToId) : undefined,
      },
      { new: true }
    ).exec();

    if (!updated) throw new Error("Task not found");

    return new Task(
      updated.id.toString(),
      updated.userStoryId.toString(),
      updated.title,
      updated.description,
      updated.status,
      updated.assignedToId?.toString(),
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await TaskModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await TaskModel.findById(new Types.ObjectId(id)).exec();
    if (!doc) return null;

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
}
