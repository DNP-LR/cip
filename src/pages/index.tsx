"use client";

import React, { useMemo, useState } from 'react';
import { Inter, Roboto_Mono } from "next/font/google";
import { Task } from '@/domain/entities/task';
import AddTaskModal from '@/components/AddTaskModal';
import { useTasks } from '@/components/hooks/useTasks';
import Header from '@/components/Header';
import StatCards from '@/components/StatCards';
import Controls from '@/components/Controls';
import KanbanView from '@/components/KanbanView';
import ListView from '@/components/ListView';
import { FileText } from 'lucide-react';
import { AddTaskUseCase } from '@/domain/use-cases/AddTask';
import { SupabaseTaskRepository } from '@/infrastructure/repositories/SupabaseTaskRepository';

const geistSans = Inter({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Roboto_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Home() {
    const { 
        tasks, 
        loading, 
        addTask, 
        toggleTaskOwner,
        toggleSubtask,
        toggleDetails,
        handleDrop,
        stats 
    } = useTasks();
    
    const [viewMode, setViewMode] = useState('list');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const taskRepository = new SupabaseTaskRepository();
    const addTaskUseCase = new AddTaskUseCase(taskRepository);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleTaskAdded = (newTask: Task) => {
        addTask(newTask);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = 'move';
        const target = e.currentTarget as HTMLDivElement;
        target.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.opacity = '1';
        setDraggedTaskId(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesFilter = true;
            if (filterStatus === 'critical') matchesFilter = task.critical;
            if (filterStatus === 'incomplete') matchesFilter = !(task.ariane && task.pavel);
            if (filterStatus === 'complete') matchesFilter = (task.ariane && task.pavel);

            return matchesSearch && matchesFilter;
        });
    }, [tasks, searchQuery, filterStatus]);

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-[#FBF6E9] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F3151] mx-auto mb-4"></div>
                    <p className="text-[#71728B] font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-[#FBF6E9] pb-16 sm:pb-24 text-[#131427]`}>
            <Header progress={stats.progress} />

            <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
                <StatCards stats={stats} />
                <Controls
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setIsAddModalOpen={setIsAddModalOpen}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                />

                {viewMode === 'kanban' ? (
                    <KanbanView
                        tasks={filteredTasks}
                        handleDragStart={handleDragStart}
                        handleDragEnd={handleDragEnd}
                        handleDragOver={handleDragOver}
                        handleDrop={(e, status) => {
                            if (draggedTaskId) {
                                handleDrop(draggedTaskId, status);
                            }
                        }}
                        toggleSubtask={toggleSubtask}
                    />
                ) : (
                    <ListView
                        tasks={filteredTasks}
                        toggleTaskOwner={toggleTaskOwner}
                        toggleSubtask={toggleSubtask}
                        toggleDetails={toggleDetails}
                    />
                )}

                <div className="mt-8 sm:mt-20 border-t border-[#A09BAD]/30 pt-6 pb-6 text-center">
                    <a href="https://justforcanada.com/fr/immigrer/entree-express/guide/documents-justificatifs/"
                       target="_blank" rel="noreferrer"
                       className="inline-flex items-center gap-2 text-[#2F3151] font-bold text-xs sm:text-sm hover:underline hover:text-[#51536D] cursor-pointer"><FileText
                        className="w-4 h-4"/> Accéder au Guide Officiel IRCC</a>
                    <p className="text-[#71728B] text-xs mt-3 font-medium tracking-wide">DESIGNED FOR ARIANE & PAVEL •
                        MIS À JOUR LE {new Date().toLocaleDateString('fr-FR').toUpperCase()}</p>
                </div>
            </div>

            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onTaskAdded={handleTaskAdded}
                addTaskUseCase={addTaskUseCase}
            />

            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}
