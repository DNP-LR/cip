import { Task } from '../entities/task';
import { TaskRepository } from '../repositories/TaskRepository';

export class AddTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(task: Omit<Task, 'id'>): Promise<Task> {
    return this.taskRepository.addTask(task);
  }
}
