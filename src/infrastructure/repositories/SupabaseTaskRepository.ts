import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { Task } from '@/domain/entities/task';
import { supabase } from '@/infrastructure/data-sources/supabase';

export class SupabaseTaskRepository implements TaskRepository {
  async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
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
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }
}
