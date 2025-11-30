import { Task } from '../entities/task';

export interface TaskRepository {
  addTask(task: Omit<Task, 'id'>): Promise<Task>;
  getTasks(): Promise<Task[]>;
  updateTask(taskId: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task>;
}
