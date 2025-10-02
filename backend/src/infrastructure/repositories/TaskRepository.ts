import { Types } from "mongoose";
import { Task } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { TaskModel } from "../models/TaskModel";
import { TaskMapper } from "../mappers/TaskMapper";

export class TaskRepository implements ITaskRepository {
  async create(task: Task): Promise<Task> {
    const doc = new TaskModel(TaskMapper.toDocument(task));
    const created = await doc.save();
    return TaskMapper.toEntity(created);
  }

  async update(task: Task): Promise<Task> {
    const updated = await TaskModel.findByIdAndUpdate(
      new Types.ObjectId(task.id),
      TaskMapper.toDocument(task),
      { new: true }
    ).exec();

    if (!updated) throw new Error("Task not found");

    return TaskMapper.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await TaskModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await TaskModel.findById(new Types.ObjectId(id)).exec();
    return doc ? TaskMapper.toEntity(doc) : null;
  }

  async findByUserStoryId(userStoryId: string): Promise<Task[]> {
    const docs = await TaskModel.find({
      userStoryId: new Types.ObjectId(userStoryId),
    }).exec();

    return docs.map(TaskMapper.toEntity);
  }
}
