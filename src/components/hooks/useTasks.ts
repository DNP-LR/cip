import { useState, useEffect, useMemo } from 'react';
import { Task } from '@/domain/entities/task';
import { GetTasksUseCase } from '@/domain/use-cases/GetTasks';
import { AddTaskUseCase } from '@/domain/use-cases/AddTask';
import { UpdateTaskUseCase } from '@/domain/use-cases/UpdateTask';
import { SupabaseTaskRepository } from '@/infrastructure/repositories/SupabaseTaskRepository';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const addTaskUseCase = new AddTaskUseCase(new SupabaseTaskRepository());
  const updateTaskUseCase = new UpdateTaskUseCase(new SupabaseTaskRepository());

  useEffect(() => {
    const taskRepository = new SupabaseTaskRepository();
    const getTasksUseCase = new GetTasksUseCase(taskRepository);
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await getTasksUseCase.execute();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task: Omit<Task, 'id'>) => {
    const newTask = await addTaskUseCase.execute(task);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {...t, ...updates} : t));
    await updateTaskUseCase.execute(taskId, updates);
  };

  const editTask = async (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    const updatedTask = await updateTaskUseCase.execute(taskId, updates);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    return updatedTask;
  };
  
  const toggleTaskOwner = async (id: string, person: 'ariane' | 'pavel' | 'both') => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    let updates = {};
    if (task.shared && person === 'both') {
        const nextVal = !(task.ariane && task.pavel);
        updates = {ariane: nextVal, pavel: nextVal};
    } else {
        if (person === 'ariane') updates = {ariane: !task.ariane};
        if (person === 'pavel') updates = {pavel: !task.pavel};
    }
    
    await updateTask(id, updates);
  };
  
  const toggleSubtask = async (taskId: string, subtaskIndex: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubtasks = [...task.subtasks];
    newSubtasks[subtaskIndex] = {
        ...newSubtasks[subtaskIndex],
        completed: !newSubtasks[subtaskIndex].completed
    };

    await updateTask(taskId, {subtasks: newSubtasks});
  };
  
  const toggleDetails = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? {...t, expanded: !t.expanded} : t));
  };
  
  const handleDrop = async (draggedTaskId: string, targetStatus: 'todo' | 'doing' | 'done') => {
    if (!draggedTaskId) return;

    const task = tasks.find(t => t.id === draggedTaskId);
    if (!task) return;

    let updates = {};
    if (targetStatus === 'todo') {
        updates = {
            ariane: false,
            pavel: false,
            subtasks: task.subtasks.map(s => ({...s, completed: false}))
        };
    } else if (targetStatus === 'done') {
        updates = {
            ariane: true,
            pavel: true,
            subtasks: task.subtasks.map(s => ({...s, completed: true}))
        };
    }

    await updateTask(draggedTaskId, updates);
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completedTasks = tasks.filter(t => t.ariane && t.pavel);
    const completed = completedTasks.length;
    const critical = tasks.filter(t => t.critical && (!t.ariane || !t.pavel)).length;

    const totalBudget = tasks.filter(t => t.id !== '10').reduce((acc, t) => acc + t.cost, 0);
    const spentAmount = completedTasks.filter(t => t.id !== '10').reduce((acc, t) => acc + t.cost, 0);
    const fundsRequired = tasks.find(t => t.id === '10')?.cost || 0;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {total, completed, critical, totalBudget, spentAmount, fundsRequired, progress};
  }, [tasks]);

  const sortByDeadline = (taskList: Task[], order: 'asc' | 'desc' = 'asc'): Task[] => {
    return [...taskList].sort((a, b) => {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  return {
    tasks,
    loading,
    addTask,
    editTask,
    sortByDeadline,
    toggleTaskOwner,
    toggleSubtask,
    toggleDetails,
    handleDrop,
    stats
  };
};
