import React from 'react';
import { Task } from '@/domain/entities/task';
import { GripVertical, ShieldAlert, AlertTriangle, Calendar } from 'lucide-react';

interface StatusBadgeProps {
    priority: 'normal' | 'high' | 'critical';
    critical: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({priority, critical}) => {
    if (critical) {
        return <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#2F3151] text-white uppercase tracking-wider"><ShieldAlert
            className="w-3 h-3 mr-1"/> Critique</span>;
    }
    if (priority === 'high') {
        return <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#A09BAD] text-white uppercase tracking-wider"><AlertTriangle
            className="w-3 h-3 mr-1"/> Important</span>;
    }
    return <span
        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBF6E9] text-[#71728B] uppercase tracking-wider border border-[#A09BAD]/30">Normal</span>;
};

interface KanbanViewProps {
    tasks: Task[];
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
    handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>, targetStatus: 'todo' | 'doing' | 'done') => void;
    toggleSubtask: (taskId: string, subtaskIndex: number) => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0
    }).format(amount);
};

const KanbanView: React.FC<KanbanViewProps> = ({ tasks, handleDragStart, handleDragEnd, handleDragOver, handleDrop, toggleSubtask }) => {
    const kanbanColumns = React.useMemo(() => {
        const todo: Task[] = [], doing: Task[] = [], done: Task[] = [];

        tasks.forEach(task => {
            const isFullyDone = task.ariane && task.pavel;
            const hasStarted = task.ariane || task.pavel || task.subtasks.some(s => s.completed);

            if (isFullyDone) {
                done.push(task);
            } else if (hasStarted) {
                doing.push(task);
            } else {
                todo.push(task);
            }
        });

        return {todo, doing, done};
    }, [tasks]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {[
                {id: 'todo', title: 'À Faire', items: kanbanColumns.todo, color: 'border-l-[#A09BAD]'},
                {id: 'doing', title: 'En Cours', items: kanbanColumns.doing, color: 'border-l-[#51536D]'},
                {id: 'done', title: 'Terminé', items: kanbanColumns.done, color: 'border-l-[#2F3151]'}
            ].map(col => (
                <div
                    key={col.id}
                    className="bg-[#FBF6E9]/50 rounded-2xl flex flex-col h-full min-h-[500px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id as 'todo' | 'doing' | 'done')}
                >
                    <div className="p-4 flex items-center justify-between mb-2">
                        <h3 className="font-black text-[#2F3151] uppercase tracking-widest text-sm">{col.title}</h3>
                        <span
                            className="bg-[#A09BAD] text-white text-xs font-bold px-2 py-0.5 rounded-full">{col.items.length}</span>
                    </div>
                    <div className="space-y-3 p-2 flex-1">
                        {col.items.map(task => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                onDragEnd={handleDragEnd}
                                className={`bg-white p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${col.color} border-l-4`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-3 h-3 text-gray-300"/>
                                        <span
                                            className="text-[10px] font-bold text-[#A09BAD]">#{task.id}</span>
                                    </div>
                                    <StatusBadge priority={task.priority} critical={task.critical}/>
                                </div>
                                <h4 className="font-bold text-[#131427] text-sm mb-2 leading-tight">{task.title}</h4>

                                {task.cost > 0 && <div
                                    className="text-[10px] font-semibold text-[#51536D] bg-gray-50 inline-block px-2 py-0.5 rounded mb-2">{formatCurrency(task.cost)}</div>}

                                {task.deadline && (
                                    <div className="mt-2 mb-3">
                                        {(() => {
                                            const deadlineDate = new Date(task.deadline);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const isLate = deadlineDate < today;

                                            return (
                                                <div
                                                    className={`text-sm font-medium flex items-center gap-2 ${isLate ? 'text-red-600' : 'text-[#51536D]'}`}>
                                                    <Calendar className="w-4 h-4"/>
                                                    {new Date(task.deadline).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {task.subtasks.length > 0 && (
                                    <div className="mb-3">
                                        <div
                                            className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[#51536D] h-full transition-all duration-300"
                                                style={{width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%`}}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span
                                                className="text-[10px] font-bold text-[#A09BAD]">{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                                            <button
                                                className="text-[10px] font-bold text-[#A09BAD] hover:text-[#2F3151]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const currentTarget = e.currentTarget as HTMLElement;
                                                    const parent = currentTarget.closest('.bg-white');
                                                    if (parent) {
                                                        const subtasksList = parent.querySelector('.subtasks-list') as HTMLElement;
                                                        if (subtasksList) {
                                                            subtasksList.classList.toggle('hidden');
                                                        }
                                                    }
                                                }}
                                            >
                                                Voir
                                            </button>
                                        </div>
                                        <div className="subtasks-list hidden mt-2 space-y-1">
                                            {task.subtasks.map((subtask, index) => (
                                                <div key={index}
                                                     className="flex items-center gap-2 p-1 rounded hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={subtask.completed}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            toggleSubtask(task.id, index);
                                                        }}
                                                        className="w-4 h-4 text-[#2F3151] rounded border-gray-300 focus:ring-[#2F3151]"
                                                    />
                                                    <span
                                                        className={`text-xs ${subtask.completed ? 'line-through text-gray-400' : 'text-[#131427]'}`}>{subtask.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-50">
                                    <div className="flex -space-x-2">
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white text-white ${task.ariane ? 'bg-[#2F3151]' : 'bg-gray-300'}`}>A
                                        </div>
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white text-white ${task.pavel ? 'bg-[#2F3151]' : 'bg-gray-300'}`}>P
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {col.items.length === 0 && (
                            <div
                                className="text-center py-12 text-[#A09BAD]/50 text-xs italic border-2 border-dashed border-[#A09BAD]/10 rounded-xl m-2">
                                Déposez ici
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default KanbanView;
