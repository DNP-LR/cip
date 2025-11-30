import React from 'react';

interface HeaderProps {
    progress: number;
}

const Header: React.FC<HeaderProps> = ({ progress }) => (
    <div className="bg-[#2F3151] pt-12 pb-32 px-6 md:px-12 shadow-xl relative overflow-hidden">
        <div
            className="absolute top-0 right-0 w-96 h-96 bg-[#51536D] opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <div className="flex items-center space-x-3 text-[#A09BAD] mb-4">
                        <span
                            className="px-3 py-1 rounded-full border border-[#A09BAD]/50 text-xs font-bold uppercase tracking-widest bg-[#2F3151]">Projet Canada</span>
                        <span className="h-px w-8 bg-[#A09BAD]/50"></span>
                        <span className="text-xs font-medium tracking-wider">ENTRÉE EXPRESS</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Tableau
                        de Bord</h1>
                    <p className="text-[#A09BAD] max-w-2xl text-base md:text-lg font-light leading-relaxed">Suivi
                        financier et administratif complet pour Ariane & Pavel.</p>
                </div>
                <div
                    className="bg-[#131427] p-6 rounded-2xl border border-[#51536D]/50 shadow-2xl min-w-[180px]">
                    <div className="flex items-baseline gap-1"><span
                        className="text-4xl font-bold text-white">{progress}</span><span
                        className="text-xl text-[#A09BAD]">%</span></div>
                    <div className="text-xs text-[#71728B] font-bold uppercase mt-2 tracking-wide">Global</div>
                    <div className="w-full bg-[#2F3151] h-2 mt-4 rounded-full overflow-hidden">
                        <div className="bg-white h-full transition-all duration-1000 ease-out"
                             style={{width: `${progress}%`}}></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Header;
