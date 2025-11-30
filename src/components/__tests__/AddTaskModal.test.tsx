import React from 'react';
import { render, screen } from '@testing-library/react';
import AddTaskModal from '../AddTaskModal';
import { AddTask } from '@/domain/use-cases/AddTask';
import { SupabaseTaskRepository } from '@/infrastructure/repositories/SupabaseTaskRepository';

jest.mock('@/infrastructure/data-sources/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({ data: [{ id: '1' }], error: null }),
  },
}));

describe('AddTaskModal', () => {
  const addTaskUseCase = new AddTask(new SupabaseTaskRepository());

  it('renders without crashing', () => {
    render(<AddTaskModal isOpen={true} onClose={() => {}} onTaskAdded={() => {}} addTaskUseCase={addTaskUseCase} />);
    expect(screen.getByText('Ajouter une Tâche')).toBeInTheDocument();
  });

  it('does not render the "Date Estimée" checkbox', () => {
    render(<AddTaskModal isOpen={true} onClose={() => {}} onTaskAdded={() => {}} addTaskUseCase={addTaskUseCase} />);
    const checkbox = screen.queryByText('Date Estimée');
    expect(checkbox).not.toBeInTheDocument();
  });
});
