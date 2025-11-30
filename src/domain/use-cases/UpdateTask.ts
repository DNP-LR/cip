import { Task } from '../entities/task';
import { TaskRepository } from '../repositories/TaskRepository';

export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
    return this.taskRepository.updateTask(taskId, updates);
  }
}
