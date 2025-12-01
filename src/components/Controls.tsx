import { Plus, Search, List as ListIcon, LayoutGrid } from 'lucide-react';

interface ControlsProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setIsAddModalOpen: (isOpen: boolean) => void;
    viewMode: string;
    setViewMode: (mode: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
    searchQuery,
    setSearchQuery,
    setIsAddModalOpen,
    viewMode,
    setViewMode,
    filterStatus,
    setFilterStatus,
}) => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full sm:w-64 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#A09BAD]"/>
            </div>
            <input
                type="text"
                placeholder="Rechercher une tâche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-[#A09BAD]/20 shadow-sm focus:ring-2 focus:ring-[#2F3151] focus:border-transparent outline-none text-[#131427]"
            />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2F3151] text-white rounded-xl font-bold text-sm hover:bg-[#131427] transition-all shadow-sm w-full sm:w-auto"
            >
                <Plus className="w-4 h-4"/> Ajouter
            </button>

            <div className="bg-white p-1 rounded-xl border border-[#A09BAD]/20 shadow-sm flex items-center w-full sm:w-auto">
                <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all flex-1 ${viewMode === 'list' ? 'bg-[#2F3151] text-white shadow' : 'text-[#71728B] hover:bg-[#FBF6E9]'}`}
                >
                    <ListIcon className="w-4 h-4"/> Liste
                </button>
                <button
                    onClick={() => setViewMode('kanban')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all flex-1 ${viewMode === 'kanban' ? 'bg-[#2F3151] text-white shadow' : 'text-[#71728B] hover:bg-[#FBF6E9]'}`}
                >
                    <LayoutGrid className="w-4 h-4"/> Kanban
                </button>
            </div>

            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-[#A09BAD]/20 shadow-sm bg-white text-[#71728B] font-bold text-sm focus:outline-none cursor-pointer w-full sm:w-auto"
            >
                <option value="all">Tout Afficher</option>
                <option value="incomplete">À Faire</option>
                <option value="complete">Terminé</option>
                <option value="critical">Critique Uniquement</option>
            </select>
        </div>
    </div>
);

export default Controls;
