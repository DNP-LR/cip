"use client";

import React, { useMemo, useState, useEffect } from 'react';
 import { Inter, Roboto_Mono } from "next/font/google";
import {
    AlertTriangle,
    Calendar,
    Check,
    CheckCircle2,
    Circle,
    DollarSign,
    FileText,
    ShieldAlert,
    Users,
    ChevronDown,
    ChevronUp,
    ListTodo,
    LayoutGrid,
    List as ListIcon,
    HeartHandshake,
    Search,
    Wallet,
    GripVertical
} from 'lucide-react';

// --- FONTS ---
// Aliased to keep the original CSS variable names used in the UI
const geistSans = Inter({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Roboto_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// --- DATA CONFIGURATION (Matched with Original Source) ---
const INITIAL_TASKS = [
    {
        id: '01',
        title: 'Passeports',
        description: 'Les passeports doivent porter vos professions (informaticien(ne)).',
        details: 'Scanner dans une bureautique. Vérifier date validité.',
        subtasks: [
            { text: 'Pavel: Vérifier mention "Informaticien"', completed: false },
            { text: 'Ariane: Vérifier mention "Informaticienne"', completed: false },
            { text: 'Scanner page identification (PDF)', completed: false }
        ],
        deadline: '2025-12-19',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 220000 // 110k * 2
    },
    {
        id: '02',
        title: 'Casier judiciaire',
        description: 'Moins de trois mois au moment du dépôt.',
        details: 'Scanner dans une bureautique.',
        subtasks: [
            { text: 'Demande au tribunal', completed: false },
            { text: 'Récupération originaux', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 5000
    },
    {
        id: '03',
        title: 'Visite Médicale',
        description: 'Prendre RDV au plus tôt à Douala (environ 230 000 FCFA).',
        details: 'À définir en fonction du RDV. Contacter centre agréé.',
        subtasks: [
            { text: 'Prise de RDV', completed: false },
            { text: 'Radio & Examens', completed: false },
            { text: 'Paiement frais', completed: false }
        ],
        deadline: '2025-12-30',
        isDateTentative: true,
        priority: 'high',
        critical: false,
        shared: true,
        cost: 230000
    },
    {
        id: '04',
        title: 'Photos (Format RP)',
        description: '50mm x 70mm. Lieu conseillé : SOPHIN Sarl (Akwa).',
        details: 'Ils connaissent les dimensions pour la demande de RP.',
        subtasks: [
            { text: 'Prise de photo (Ariane & Pavel)', completed: false },
            { text: 'Récupération fichiers numériques', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 5000
    },
    {
        id: '05',
        title: 'Documents Civils (Naissance & CNI)',
        description: 'Scanner dans une bureautique (Pas de téléphone !).',
        details: 'Actes de naissance visibles au complet + CNI recto-verso bien claires.',
        subtasks: [
            { text: 'Scanner Acte Naissance (Ariane)', completed: false },
            { text: 'Scanner Acte Naissance (Pavel)', completed: false },
            { text: 'Scanner CNI Recto-Verso (Ariane)', completed: false },
            { text: 'Scanner CNI Recto-Verso (Pavel)', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 2000
    },
    {
        id: '06',
        title: 'Diplômes (Bac, Licence...)',
        description: 'Scanner dans une bureautique (Pas de téléphone).',
        details: 'Joindre aussi les attestations de réussite si disponibles.',
        subtasks: [
            { text: 'Scanner Diplômes Ariane', completed: false },
            { text: 'Scanner Diplômes Pavel', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 0
    },
    {
        id: '07',
        title: 'Preuve des conjoints (Union de Fait)',
        description: 'Cohabitation > 12 mois. Factures aux deux noms.',
        details: 'CRITIQUE. Certificat déclaration notarié, Factures électro (TV, Frigo), Services publics, Bail.',
        subtasks: [
            { text: 'Certificat déclaration (Notaire)', completed: false },
            { text: 'Factures Electro (2 noms)', completed: false },
            { text: 'Contrat de location (2 noms)', completed: false },
            { text: 'Factures ENEO/Internet', completed: false }
        ],
        deadline: '2025-12-19',
        priority: 'critical',
        critical: true,
        shared: true,
        cost: 25000
    },
    {
        id: '08',
        title: 'Preuves professionnelles',
        description: 'Attestations, Fiches de paie, Contrats (40h/sem).',
        details: 'Ariane: New BTP (Tech Réseau) | Pavel: GRACOVI (Gestionnaire Sys).\nContacter chefs d\'entreprise pour signature.',
        subtasks: [
            { text: 'Signatures New BTP (Ariane)', completed: false },
            { text: 'Signatures GRACOVI (Pavel)', completed: false },
            { text: 'Rassembler fiches de paie', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'critical',
        critical: true,
        shared: false,
        cost: 0
    },
    {
        id: '09',
        title: 'Frais de résidence',
        description: '1 500 000 FCFA environ. À payer dans 35 jours.',
        subtasks: [
            { text: 'Rassembler les fonds', completed: false },
            { text: 'Effectuer paiement en ligne', completed: false }
        ],
        deadline: '2026-01-15',
        isDateTentative: true,
        priority: 'high',
        critical: false,
        shared: true,
        cost: 1500000
    },
    {
        id: '10',
        title: 'Preuve de fond (> 7.8M FCFA)',
        description: 'Attestation domiciliation, Relevés 6 mois, Dons notariés.',
        details: 'CRITIQUE. Pavel doit ajouter Ariane au compte Afriland (Signature conjointe obligatoire).',
        subtasks: [
            { text: 'Ajout Ariane compte Afriland', completed: false },
            { text: 'Certificats de dons (Notaire)', completed: false },
            { text: 'Attestation de solde > 7.8M', completed: false }
        ],
        deadline: '2025-12-31',
        priority: 'critical',
        critical: true,
        shared: true,
        cost: 7800000
    },
    {
        id: '12',
        title: 'Tests de langues',
        description: 'TCF (Ariane) et TCF + IELTS (Pavel).',
        details: 'Maximiser les points.',
        subtasks: [
            { text: 'Passage TCF Ariane', completed: false },
            { text: 'Passage TCF Pavel', completed: false },
            { text: 'Passage IELTS Pavel', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'high',
        critical: true,
        shared: false,
        cost: 590000
    },
    {
        id: '13',
        title: 'Évaluation WES (EDE)',
        description: 'Ariane ET Pavel. Frais WES + Univ + DHL.',
        details: 'Pour les deux candidats. Création comptes + Envoi docs.',
        subtasks: [
            { text: 'Compte WES Ariane + Paiement', completed: false },
            { text: 'Compte WES Pavel + Paiement', completed: false },
            { text: 'Envoi DHL documents', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'high',
        critical: true,
        shared: true,
        cost: 480000 // Approx for two
    },
    {
        id: '14',
        title: 'CV Canadien',
        description: 'CV conforme aux différents postes visés.',
        subtasks: [
            { text: 'Rédaction CV Ariane (Format Canadien)', completed: false },
            { text: 'Rédaction CV Pavel (Format Canadien)', completed: false }
        ],
        deadline: '2025-12-12',
        priority: 'normal',
        critical: false,
        shared: true,
        cost: 0
    }
].map(t => ({ ...t, ariane: false, pavel: false, expanded: true }));

// --- COMPONENTS ---

type Task = typeof INITIAL_TASKS[0];

const StatusBadge = ({ priority, critical }: { priority: string, critical: boolean }) => {
    if (critical) {
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#2F3151] text-white uppercase tracking-wider"><ShieldAlert className="w-3 h-3 mr-1" /> Critique</span>;
    }
    if (priority === 'high') {
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#A09BAD] text-white uppercase tracking-wider"><AlertTriangle className="w-3 h-3 mr-1" /> Important</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBF6E9] text-[#71728B] uppercase tracking-wider border border-[#A09BAD]/30">Normal</span>;
};

const StatCard = ({ icon: Icon, title, value, subtext, colorClass, delay }: { icon: React.ElementType, title: string, value: string | number, subtext: string, colorClass: string, delay: number }) => (
    <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#A09BAD]/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default" style={{ animation: `fadeIn 0.5s ease-out ${delay}s backwards` }}>
        <div className={`p-3 lg:p-4 rounded-xl ${colorClass} text-white shadow-md flex-shrink-0`}>
            <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#71728B] uppercase tracking-wider mb-1 truncate">{title}</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-[#131427] tracking-tight truncate" title={String(value)}>{value}</h3>
            <p className="text-xs text-[#51536D] mt-1 font-medium truncate">{subtext}</p>
        </div>
    </div>
);

// --- MAIN APP ---

export default function Home() {
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [viewMode, setViewMode] = useState('list');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null); // For Drag & Drop
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // --- LOGIC ACTIONS ---

    const toggleTaskOwner = (id: string, person: string) => {
        setTasks(prev => prev.map(task => {
            if (task.id !== id) return task;
            const newState = { ...task };
            if (task.shared && person === 'both') {
                const nextVal = !(task.ariane && task.pavel);
                newState.ariane = nextVal;
                newState.pavel = nextVal;
            } else {
                if (person === 'ariane') newState.ariane = !newState.ariane;
                if (person === 'pavel') newState.pavel = !newState.pavel;
            }
            return newState;
        }));
    };

    const toggleSubtask = (taskId: string, subtaskIndex: number) => {
        setTasks(prev => prev.map(task => {
            if (task.id !== taskId) return task;
            const newSubtasks = [...task.subtasks];
            newSubtasks[subtaskIndex] = { ...newSubtasks[subtaskIndex], completed: !newSubtasks[subtaskIndex].completed };
            return { ...task, subtasks: newSubtasks };
        }));
    };

    const toggleDetails = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
    };

    // --- DRAG & DROP HANDLERS ---

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = 'move';
        // Add a slight transparency to the dragged item visual
        (e.target as HTMLElement).style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1';
        setDraggedTaskId(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault();
        if (!draggedTaskId) return;

        setTasks(prev => prev.map(task => {
            if (task.id !== draggedTaskId) return task;

            const newState = { ...task };

            // Logic for state change based on column drop
            if (targetStatus === 'todo') {
                newState.ariane = false;
                newState.pavel = false;
                newState.subtasks = task.subtasks.map(s => ({ ...s, completed: false }));
            } else if (targetStatus === 'done') {
                newState.ariane = true;
                newState.pavel = true;
                newState.subtasks = task.subtasks.map(s => ({ ...s, completed: true }));
            }
            // 'doing' doesn't necessarily force state, just keeps it as is or ensures it's not empty

            return newState;
        }));
    };

    // --- CALCULATIONS ---

    const getDaysRemaining = (deadline: string) => {
        const today = new Date();
        const target = new Date(deadline);
        const diffTime = Number(target) - Number(today);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
    };
    const stats = useMemo(() => {
        const total = tasks.length;
        const completedTasks = tasks.filter(t => t.ariane && t.pavel);
        const completed = completedTasks.length;
        const critical = tasks.filter(t => t.critical && (!t.ariane || !t.pavel)).length;

        // Budget calculations
        // ID 10 (POF) is savings, not expense
        const totalBudget = tasks.filter(t => t.id !== '10').reduce((acc, t) => acc + t.cost, 0);

        // Spent amount: Sum of costs of completed tasks (excluding POF)
        const spentAmount = completedTasks.filter(t => t.id !== '10').reduce((acc, t) => acc + t.cost, 0);

        const fundsRequired = tasks.find(t => t.id === '10')?.cost || 0;
        const progress = Math.round((completed / total) * 100);

        return { total, completed, critical, totalBudget, spentAmount, fundsRequired, progress };
    }, [tasks]);

    // --- FILTERING & COLUMNS ---

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Text Search
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase());

            // Status Filter
            let matchesFilter = true;
            if (filterStatus === 'critical') matchesFilter = task.critical;
            if (filterStatus === 'incomplete') matchesFilter = !(task.ariane && task.pavel);
            if (filterStatus === 'complete') matchesFilter = (task.ariane && task.pavel);

            return matchesSearch && matchesFilter;
        });
    }, [tasks, searchQuery, filterStatus]);

    const kanbanColumns = useMemo(() => {
        const todo: Task[] = [], doing: Task[] = [], done: Task[] = [];

        filteredTasks.forEach(task => {
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

        return { todo, doing, done };
    }, [filteredTasks]);

    if (!mounted) return null;

    return (
        <div className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-[#FBF6E9] pb-24 text-[#131427]`}>
            {/* HEADER */}
            <div className="bg-[#2F3151] pt-12 pb-32 px-6 md:px-12 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#51536D] opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div>
                            <div className="flex items-center space-x-3 text-[#A09BAD] mb-4">
                                <span className="px-3 py-1 rounded-full border border-[#A09BAD]/50 text-xs font-bold uppercase tracking-widest bg-[#2F3151]">Projet Canada</span>
                                <span className="h-px w-8 bg-[#A09BAD]/50"></span>
                                <span className="text-xs font-medium tracking-wider">ENTRÉE EXPRESS</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Tableau de Bord</h1>
                            <p className="text-[#A09BAD] max-w-2xl text-base md:text-lg font-light leading-relaxed">Suivi financier et administratif complet pour Ariane & Pavel.</p>
                        </div>
                        <div className="bg-[#131427] p-6 rounded-2xl border border-[#51536D]/50 shadow-2xl min-w-[180px]">
                            <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-white">{stats.progress}</span><span className="text-xl text-[#A09BAD]">%</span></div>
                            <div className="text-xs text-[#71728B] font-bold uppercase mt-2 tracking-wide">Global</div>
                            <div className="w-full bg-[#2F3151] h-2 mt-4 rounded-full overflow-hidden">
                                <div className="bg-white h-full transition-all duration-1000 ease-out" style={{ width: `${stats.progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-24 relative z-20">
                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    <StatCard delay={0.1} icon={ShieldAlert} title="Critiques" value={stats.critical} subtext="Tâches bloquantes" colorClass="bg-[#2F3151]" />
                    <StatCard delay={0.2} icon={DollarSign} title="Budget Total" value={formatCurrency(stats.totalBudget)} subtext="Estimation coûts" colorClass="bg-[#51536D]" />
                    <StatCard delay={0.3} icon={Wallet} title="Déjà Payé" value={formatCurrency(stats.spentAmount)} subtext="Sortie de caisse" colorClass="bg-[#131427]" />
                    <StatCard delay={0.4} icon={CheckCircle2} title="Fonds Requis" value={formatCurrency(stats.fundsRequired)} subtext="Épargne bloquée" colorClass="bg-[#71728B]" />
                </div>

                {/* CONTROLS (Search, View, Filter) */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">

                    {/* Search Bar */}
                    <div className="relative w-full lg:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-[#A09BAD]" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher une tâche..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-[#A09BAD]/20 shadow-sm focus:ring-2 focus:ring-[#2F3151] focus:border-transparent outline-none text-[#131427]"
                        />
                    </div>

                    <div className="flex gap-4 w-full lg:w-auto">
                        {/* View Switcher */}
                        <div className="bg-white p-1 rounded-xl border border-[#A09BAD]/20 shadow-sm flex items-center">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-[#2F3151] text-white shadow' : 'text-[#71728B] hover:bg-[#FBF6E9]'}`}
                            >
                                <ListIcon className="w-4 h-4" /> Liste
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'kanban' ? 'bg-[#2F3151] text-white shadow' : 'text-[#71728B] hover:bg-[#FBF6E9]'}`}
                            >
                                <LayoutGrid className="w-4 h-4" /> Kanban
                            </button>
                        </div>

                        {/* Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-[#A09BAD]/20 shadow-sm bg-white text-[#71728B] font-bold text-sm focus:outline-none cursor-pointer"
                        >
                            <option value="all">Tout Afficher</option>
                            <option value="incomplete">À Faire</option>
                            <option value="complete">Terminé</option>
                            <option value="critical">Critique Uniquement</option>
                        </select>
                    </div>
                </div>

                {/* --- KANBAN VIEW --- */}
                {viewMode === 'kanban' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                        {[
                            { id: 'todo', title: 'À Faire', items: kanbanColumns.todo, color: 'border-l-[#A09BAD]' },
                            { id: 'doing', title: 'En Cours', items: kanbanColumns.doing, color: 'border-l-[#51536D]' },
                            { id: 'done', title: 'Terminé', items: kanbanColumns.done, color: 'border-l-[#2F3151]' }
                        ].map(col => (
                            <div
                                key={col.id}
                                className="bg-[#FBF6E9]/50 rounded-2xl flex flex-col h-full min-h-[500px]"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, col.id)}
                            >
                                <div className="p-4 flex items-center justify-between mb-2">
                                    <h3 className="font-black text-[#2F3151] uppercase tracking-widest text-sm">{col.title}</h3>
                                    <span className="bg-[#A09BAD] text-white text-xs font-bold px-2 py-0.5 rounded-full">{col.items.length}</span>
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
                                                    <GripVertical className="w-3 h-3 text-gray-300" />
                                                    <span className="text-[10px] font-bold text-[#A09BAD]">#{task.id}</span>
                                                </div>
                                                <StatusBadge priority={task.priority} critical={task.critical} />
                                            </div>
                                            <h4 className="font-bold text-[#131427] text-sm mb-2 leading-tight">{task.title}</h4>

                                            {/* Cost Pill */}
                                            {task.cost > 0 && <div className="text-[10px] font-semibold text-[#51536D] bg-gray-50 inline-block px-2 py-0.5 rounded mb-2">{formatCurrency(task.cost)}</div>}

                                            {/* Mini Subtasks Progress */}
                                            {task.subtasks.length > 0 && (
                                                <div className="mb-3">
                                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-[#51536D] h-full transition-all duration-300"
                                                            style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-50">
                                                <div className="flex -space-x-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white text-white ${task.ariane ? 'bg-[#2F3151]' : 'bg-gray-300'}`}>A</div>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white text-white ${task.pavel ? 'bg-[#2F3151]' : 'bg-gray-300'}`}>P</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {col.items.length === 0 && (
                                        <div className="text-center py-12 text-[#A09BAD]/50 text-xs italic border-2 border-dashed border-[#A09BAD]/10 rounded-xl m-2">
                                            Déposez ici
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- LIST VIEW --- */}
                {viewMode === 'list' && (
                    <div className="space-y-8 animate-fadeIn">
                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-20 text-[#A09BAD] font-bold">Aucune tâche ne correspond à votre recherche.</div>
                        ) : (
                            filteredTasks.map((task, index) => {
                                const isComplete = task.ariane && task.pavel;
                                const daysLeft = getDaysRemaining(task.deadline);
                                const isLate = daysLeft < 0 && !isComplete;

                                return (
                                    <div key={task.id} className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl ${isComplete ? 'border-[#A09BAD]/20 opacity-80' : task.critical ? 'border-l-[6px] border-l-[#2F3151]' : 'border-l-[6px] border-l-[#A09BAD]'}`}>
                                        <div className="p-6 md:p-8">
                                            <div className="flex flex-col lg:flex-row gap-8">
                                                <div className="flex-grow space-y-4 min-w-0">
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <span className="text-xs font-black text-[#A09BAD] tracking-widest">#{task.id}</span>
                                                            <StatusBadge priority={task.priority} critical={task.critical}/>
                                                            {task.id === '07' && <span className="flex items-center text-xs font-bold text-[#2F3151] bg-[#FBF6E9] px-2 py-1 rounded"><HeartHandshake className="w-3 h-3 mr-1"/> Union de Fait</span>}
                                                        </div>
                                                        <h3 className={`text-xl font-bold ${isComplete ? 'text-[#A09BAD] line-through' : 'text-[#131427]'}`}>{task.title}</h3>
                                                    </div>
                                                    <p className="text-[#51536D] leading-relaxed max-w-3xl">{task.description}</p>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-3 pt-2">
                                                        {task.cost > 0 && <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border border-[#A09BAD]/20 ${isComplete ? 'bg-[#FBF6E9] text-[#A09BAD] line-through' : 'bg-[#131427] text-white'}`}><DollarSign className="w-3 h-3 mr-1"/>{formatCurrency(task.cost)}</span>}
                                                        <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border border-[#A09BAD]/20 ${task.shared ? 'bg-[#2F3151]/5 text-[#2F3151]' : 'bg-[#FBF6E9] text-[#71728B]'}`}><Users className="w-3 h-3 mr-1"/> {task.shared ? 'Dossier Commun' : 'Tâche Individuelle'}</span>
                                                    </div>

                                                    {/* Checklist */}
                                                    <div className="mt-6 bg-[#FBF6E9]/50 rounded-xl p-4 md:p-6 border border-[#A09BAD]/10">
                                                        <div className="flex items-center justify-between cursor-pointer mb-4" onClick={() => toggleDetails(task.id)}>
                                                            <h4 className="flex items-center text-xs font-black text-[#2F3151] uppercase tracking-widest"><ListTodo className="w-4 h-4 mr-2"/> Checklist</h4>
                                                            <button className="text-[#51536D]">{task.expanded ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}</button>
                                                        </div>
                                                        <div className={`space-y-3 transition-all duration-300 ${task.expanded ? 'block' : 'hidden'}`}>
                                                            {task.details && <div className="flex items-start gap-3 text-sm text-[#51536D] italic bg-white p-3 rounded-lg border border-[#A09BAD]/10 mb-4"><FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#A09BAD]"/>{task.details}</div>}
                                                            <div className="grid gap-3">
                                                                {task.subtasks.map((st, i) => (
                                                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${st.completed ? 'bg-[#E0E2E5] border-transparent opacity-60' : 'bg-white border-[#A09BAD]/20 hover:border-[#2F3151]/30'}`} onClick={() => toggleSubtask(task.id, i)}>
                                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${st.completed ? 'bg-[#2F3151] border-[#2F3151]' : 'bg-white border-[#A09BAD]'}`}>{st.completed && <Check className="w-3.5 h-3.5 text-white" />}</div>
                                                                        <span className={`text-sm font-medium ${st.completed ? 'text-[#71728B] line-through' : 'text-[#131427]'}`}>{st.text}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col justify-between min-w-[260px] border-t lg:border-t-0 lg:border-l border-[#A09BAD]/20 pt-6 lg:pt-0 lg:pl-8">
                                                    <div className="mb-6 lg:text-right">
                                                        <span className="text-xs font-bold text-[#A09BAD] uppercase tracking-wider block mb-1">Date Limite</span>
                                                        <div className={`text-lg font-bold flex items-center lg:justify-end gap-2 ${isLate ? 'text-red-600' : 'text-[#131427]'}`}>
                                                            <Calendar className="w-4 h-4"/>
                                                            {task.isDateTentative ? 'Environ ' : ''}{new Date(task.deadline).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short', year: 'numeric'})}
                                                        </div>
                                                        {!isComplete && !task.isDateTentative && <span className={`inline-block mt-2 px-3 py-1 rounded-md text-xs font-bold ${isLate ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-[#FBF6E9] text-[#71728B]'}`}>{isLate ? 'En retard !' : `${daysLeft} jours restants`}</span>}
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="text-xs font-bold text-[#A09BAD] uppercase tracking-wider lg:text-right mb-2">Responsables</div>
                                                        {task.shared ? (
                                                            <button onClick={() => toggleTaskOwner(task.id, 'both')} className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${isComplete ? 'bg-[#2F3151] border-[#2F3151] text-white' : 'bg-white border-[#A09BAD]/30 hover:border-[#2F3151] text-[#131427]'}`}>
                                                                <span className="font-bold text-sm">Marquer Tout Fait</span>{isComplete ? <CheckCircle2 className="w-5 h-5 text-white"/> : <Circle className="w-5 h-5 text-[#A09BAD] group-hover:text-[#2F3151]"/>}
                                                            </button>
                                                        ) : (
                                                            <div className="flex flex-col gap-3">
                                                                <button onClick={() => toggleTaskOwner(task.id, 'ariane')} className={`w-full p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${task.ariane ? 'bg-[#131427] border-[#131427] text-white shadow-md' : 'bg-white border-[#A09BAD]/30 hover:border-[#51536D] text-[#131427]'}`}>
                                                                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${task.ariane ? 'bg-[#A09BAD]' : 'bg-[#A09BAD]/50'}`}></div><span className="font-bold text-sm">Ariane</span></div>{task.ariane ? <CheckCircle2 className="w-5 h-5 text-white"/> : <Circle className="w-5 h-5 text-[#A09BAD] group-hover:text-[#51536D]"/>}
                                                                </button>
                                                                <button onClick={() => toggleTaskOwner(task.id, 'pavel')} className={`w-full p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${task.pavel ? 'bg-[#131427] border-[#131427] text-white shadow-md' : 'bg-white border-[#A09BAD]/30 hover:border-[#51536D] text-[#131427]'}`}>
                                                                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${task.pavel ? 'bg-[#A09BAD]' : 'bg-[#A09BAD]/50'}`}></div><span className="font-bold text-sm">Pavel</span></div>{task.pavel ? <CheckCircle2 className="w-5 h-5 text-white"/> : <Circle className="w-5 h-5 text-[#A09BAD] group-hover:text-[#51536D]"/>}
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
                )}

                {/* FOOTER */}
                <div className="mt-20 border-t border-[#A09BAD]/30 pt-10 pb-10 text-center">
                    <a href="https://justforcanada.com/fr/immigrer/entree-express/guide/documents-justificatifs/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#2F3151] font-bold text-sm hover:underline hover:text-[#51536D] cursor-pointer"><FileText className="w-4 h-4"/> Accéder au Guide Officiel IRCC</a>
                    <p className="text-[#71728B] text-xs mt-4 font-medium tracking-wide">DESIGNED FOR ARIANE & PAVEL • MIS À JOUR LE {new Date().toLocaleDateString('fr-FR').toUpperCase()}</p>
                </div>
            </div>
        </div>
    );
}