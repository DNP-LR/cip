export interface Subtask {
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  details: string;
  subtasks: Subtask[];
  deadline: string;
  priority: 'normal' | 'high' | 'critical';
  critical: boolean;
  shared: boolean;
  cost: number;
  ariane: boolean;
  pavel: boolean;
  expanded: boolean;
  isDateTentative: boolean;
}
