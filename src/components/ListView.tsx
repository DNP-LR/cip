import React from 'react';
import { Task } from '@/domain/entities/task';
import {
    AlertTriangle,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    DollarSign,
    FileText,
    HeartHandshake,
    ListTodo,
    Pencil,
    ShieldAlert,
    Users
} from 'lucide-react';

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

interface ListViewProps {
    tasks: Task[];
    toggleTaskOwner: (id: string, person: 'ariane' | 'pavel' | 'both') => void;
    toggleSubtask: (taskId: string, subtaskIndex: number) => void;
    toggleDetails: (id: string) => void;
    onEditClick: (task: Task) => void;
}

const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0
    }).format(amount);
};

const ListView: React.FC<ListViewProps> = ({ tasks, toggleTaskOwner, toggleSubtask, toggleDetails, onEditClick }) => (
    <div className="space-y-8 animate-fadeIn">
        {tasks.length === 0 ? (
            <div className="text-center py-20 text-[#A09BAD] font-bold">Aucune tâche ne correspond à
                votre recherche.</div>
        ) : (
            tasks.map((task) => {
                const isComplete = task.ariane && task.pavel;
                const daysLeft = getDaysRemaining(task.deadline);
                const isLate = daysLeft < 0 && !isComplete;

                return (
                    <div key={task.id}
                         className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl ${isComplete ? 'border-[#A09BAD]/20 opacity-80' : task.critical ? 'border-l-[6px] border-l-[#2F3151]' : 'border-l-[6px] border-l-[#A09BAD]'}`}>
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex-grow space-y-4 min-w-0">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className="text-xs font-black text-[#A09BAD] tracking-widest">#{task.id}</span>
                                            <StatusBadge priority={task.priority}
                                                         critical={task.critical}/>
                                            {task.id === '07' && <span
                                                className="flex items-center text-xs font-bold text-[#2F3151] bg-[#FBF6E9] px-2 py-1 rounded"><HeartHandshake
                                                className="w-3 h-3 mr-1"/> Union de Fait</span>}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <h3 className={`text-xl font-bold ${isComplete ? 'text-[#A09BAD] line-through' : 'text-[#131427]'}`}>{task.title}</h3>
                                            <button
                                                onClick={() => onEditClick(task)}
                                                className="text-[#A09BAD] hover:text-[#2F3151] p-1 rounded-full hover:bg-[#FBF6E9] transition-colors"
                                                aria-label="Modifier la tâche"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[#51536D] leading-relaxed">{task.description}</p>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {task.cost > 0 && <span
                                            className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border border-[#A09BAD]/20 ${isComplete ? 'bg-[#FBF6E9] text-[#A09BAD] line-through' : 'bg-[#131427] text-white'}`}><DollarSign
                                            className="w-3 h-3 mr-1"/>{formatCurrency(task.cost)}</span>}
                                        <span
                                            className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border border-[#A09BAD]/20 ${task.shared ? 'bg-[#2F3151]/5 text-[#2F3151]' : 'bg-[#FBF6E9] text-[#71728B]'}`}><Users
                                            className="w-3 h-3 mr-1"/> {task.shared ? 'Dossier Commun' : 'Tâche Individuelle'}</span>
                                    </div>

                                    <div
                                        className="mt-4 bg-[#FBF6E9]/50 rounded-xl p-4 border border-[#A09BAD]/10">
                                        <div
                                            className="flex items-center justify-between cursor-pointer mb-4"
                                            onClick={() => toggleDetails(task.id)}>
                                            <h4 className="flex items-center text-xs font-black text-[#2F3151] uppercase tracking-widest">
                                                <ListTodo className="w-4 h-4 mr-2"/> Checklist</h4>
                                            <button className="text-[#51536D]">{task.expanded ?
                                                <ChevronUp className="w-4 h-4"/> :
                                                <ChevronDown className="w-4 h-4"/>}</button>
                                        </div>
                                        <div
                                            className={`space-y-3 transition-all duration-300 ${task.expanded ? 'block' : 'hidden'}`}>
                                            {task.details && <div
                                                className="flex items-start gap-3 text-sm text-[#51536D] italic bg-white p-3 rounded-lg border border-[#A09BAD]/10 mb-4">
                                                <FileText
                                                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#A09BAD]"/>{task.details}
                                            </div>}
                                            <div className="grid gap-3">
                                                {task.subtasks.map((st, i) => (
                                                    <div key={i}
                                                         className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${st.completed ? 'bg-[#E0E2E5] border-transparent opacity-60' : 'bg-white border-[#A09BAD]/20 hover:border-[#2F3151]/30'}`}
                                                         onClick={() => toggleSubtask(task.id, i)}>
                                                        <div
                                                            className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${st.completed ? 'bg-[#2F3151] border-[#2F3151]' : 'bg-white border-[#A09BAD]'}`}>{st.completed &&
                                                            <Check
                                                                className="w-3.5 h-3.5 text-white"/>}</div>
                                                        <span
                                                            className={`text-sm font-medium ${st.completed ? 'text-[#71728B] line-through' : 'text-[#131427]'}`}>{st.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="flex flex-col gap-6 pt-4 border-t border-[#A09BAD]/20">
                                    <div className="mb-4">
                                        <span
                                            className="text-xs font-bold text-[#A09BAD] uppercase tracking-wider block mb-1">Date Limite</span>
                                        <div
                                            className={`text-lg font-bold flex items-center gap-2 ${isLate ? 'text-red-600' : 'text-[#131427]'}`}>
                                            <Calendar className="w-4 h-4"/>
                                            {new Date(task.deadline).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                        </div>
                                        {!isComplete && <span
                                            className={`inline-block mt-2 px-3 py-1 rounded-md text-xs font-bold ${isLate ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-[#FBF6E9] text-[#71728B]'}`}>{isLate ? 'En retard !' : `${daysLeft} jours restants`}</span>}
                                    </div>
									<div className="space-y-4">
                                        <div
                                            className="text-xs font-bold text-[#A09BAD] uppercase tracking-wider mb-2">Responsables
                                        </div>
                                        {task.shared ? (
                                            <button onClick={() => toggleTaskOwner(task.id, 'both')}
                                                    className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${isComplete ? 'bg-[#2F3151] border-[#2F3151] text-white' : 'bg-white border-[#A09BAD]/30 hover:border-[#2F3151] text-[#131427]'}`}>
                                                <span
                                                    className="font-bold text-sm">Marquer Tout Fait</span>{isComplete ?
                                                <CheckCircle2 className="w-5 h-5 text-white"/> : <Circle
                                                    className="w-5 h-5 text-[#A09BAD] group-hover:text-[#2F3151]"/>}
                                            </button>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    onClick={() => toggleTaskOwner(task.id, 'ariane')}
                                                    className={`w-full p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${task.ariane ? 'bg-[#131427] border-[#131427] text-white shadow-md' : 'bg-white border-[#A09BAD]/30 hover:border-[#51536D] text-[#131427]'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${task.ariane ? 'bg-[#A09BAD]' : 'bg-[#A09BAD]/50'}`}></div>
                                                        <span
                                                            className="font-bold text-sm">Ariane</span>
                                                    </div>
                                                    {task.ariane ?
                                                        <CheckCircle2 className="w-5 h-5 text-white"/> :
                                                        <Circle
                                                            className="w-5 h-5 text-[#A09BAD] group-hover:text-[#51536D]"/>}
                                                </button>
                                                <button
                                                    onClick={() => toggleTaskOwner(task.id, 'pavel')}
                                                    className={`w-full p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${task.pavel ? 'bg-[#131427] border-[#131427] text-white shadow-md' : 'bg-white border-[#A09BAD]/30 hover:border-[#51536D] text-[#131427]'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${task.pavel ? 'bg-[#A09BAD]' : 'bg-[#A09BAD]/50'}`}></div>
                                                        <span className="font-bold text-sm">Pavel</span>
                                                    </div>
                                                    {task.pavel ?
                                                        <CheckCircle2 className="w-5 h-5 text-white"/> :
                                                        <Circle
                                                            className="w-5 h-5 text-[#A09BAD] group-hover:text-[#51536D]"/>}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
        )}
    </div>
);

export default ListView;
