import { v4 as uuidv4 } from 'uuid';
import {TaskRepository} from "@/domain/repositories/TaskRepository";
import {Task} from "@/domain/entities/task";
import {supabase} from "@/infrastructure/data-sources/supabase";

export class SupabaseTaskRepository implements TaskRepository {
    async addTask(task: Omit<Task, 'id'>): Promise<Task> {
        const { isDateTentative, ...taskToInsert } = task;
        const taskWithId = { ...taskToInsert, id: uuidv4() };
        const { data, error } = await supabase
            .from('tasks')
            .insert([taskWithId])
            .select();
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }

  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  }

  async updateTask(taskId: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
    const { isDateTentative, ...taskToUpdate } = updates;
    const { data, error } = await supabase
      .from('tasks')
      .update(taskToUpdate)
      .eq('id', taskId)
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }
}
