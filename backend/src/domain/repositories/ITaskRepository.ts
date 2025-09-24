import { Task } from "../entities/Task";


export interface ITaskRepository {
  create(sprint: Task): Promise<Task>;
  update(sprint: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  delete(id: string): Promise<void>;
}