"use client";
import React, {useEffect, useState} from 'react';
import {Task} from "@/domain/entities/task";
import { AddTaskUseCase } from '@/domain/use-cases/AddTask';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskAdded: (task: Task) => void;
    addTaskUseCase: AddTaskUseCase;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({isOpen, onClose, onTaskAdded, addTaskUseCase}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState<'normal' | 'high' | 'critical'>('normal');
    const [critical, setCritical] = useState(false);
    const [shared, setShared] = useState(false);
    const [isDateTentative, setIsDateTentative] = useState(false);
    const [cost, setCost] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const newTask = await addTaskUseCase.execute({
                title,
                description,
                details,
                deadline,
                priority,
                critical,
                shared,
                isDateTentative,
                cost,
                subtasks: [],
                ariane: false,
                pavel: false,
                expanded: false,
            });
            onTaskAdded(newTask);

            // Reset form
            setTitle('');
            setDescription('');
            setDetails('');
            setDeadline('');
            setCost(0);
            setIsDateTentative(false);
            onClose();
        } catch (error) {
            setError("Failed to add task. Please check the console for details.");
            console.error("Failed to add task", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#131427]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#A09BAD]/30">
                <div className="bg-[#2F3151] px-6 py-4 border-b border-[#51536D]">
                    <h2 className="text-xl font-bold text-white">Ajouter une Tâche</h2>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                        <button onClick={() => setError('')} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg className="fill-current h-6 w-6 text-red-500" role="button"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path
                                    d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                            </svg>
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label
                            className="block text-xs font-bold text-[#A09BAD] uppercase tracking-wider mb-1">Titre</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-[#A09BAD]/30 px-3 py-2 text-[#131427] focus:ring-2 focus:ring-[#2F3151] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block text-xs font-bold text-[#A09BAD] uppercase tracking-wider mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg border border-[#A09BAD]/30 px-3 py-2 text-[#131427] focus:ring-2 focus:ring-[#2F3151] outline-none"
                            rows={2}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#A09BAD] uppercase tracking-wider mb-1">Détails
                            (Technique)</label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full rounded-lg border border-[#A09BAD]/30 px-3 py-2 text-[#131427] focus:ring-2 focus:ring-[#2F3151] outline-none text-sm"
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#A09BAD] uppercase tracking-wider mb-1">Date
                                Limite</label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full rounded-lg border border-[#A09BAD]/30 px-3 py-2 text-[#131427] focus:ring-2 focus:ring-[#2F3151] outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block text-xs font-bold text-[#A09BAD] uppercase tracking-wider mb-1">Priorité</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as 'normal' | 'high' | 'critical')}
                                className="w-full rounded-lg border border-[#A09BAD]/30 px-3 py-2 text-[#131427] focus:ring-2 focus:ring-[#2F3151] outline-none bg-white"
                            >
                                <option value="normal">Normal</option>
                                <option value="high">Important</option>
                                <option value="critical">Critique</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#A09BAD] uppercase tracking-wider mb-1">Coût
                            Estimé (FCFA)</label>
                        <input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(Number(e.target.value))}
                            className="w-full rounded-lg border border-[#A09BAD]/30 px-3 py-2 text-[#131427] focus:ring-2 focus:ring-[#2F3151] outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={critical}
                                onChange={(e) => setCritical(e.target.checked)}
                                className="w-4 h-4 text-[#2F3151] rounded border-gray-300 focus:ring-[#2F3151]"
                            />
                            <span className="text-sm font-medium text-[#131427]">Marquer Critique</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={shared}
                                onChange={(e) => setShared(e.target.checked)}
                                className="w-4 h-4 text-[#2F3151] rounded border-gray-300 focus:ring-[#2F3151]"
                            />
                            <span className="text-sm font-medium text-[#131427]">Dossier Partagé</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDateTentative}
                                onChange={(e) => setIsDateTentative(e.target.checked)}
                                className="w-4 h-4 text-[#2F3151] rounded border-gray-300 focus:ring-[#2F3151]"
                            />
                            <span className="text-sm font-medium text-[#131427]">Date Estimée</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-bold text-[#71728B] hover:bg-[#FBF6E9] rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#2F3151] hover:bg-[#131427] rounded-lg shadow transition-all flex items-center"
                        >
                            {loading ? 'Ajout...' : 'Créer la Tâche'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;