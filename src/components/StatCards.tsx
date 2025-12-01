import React from 'react';
import { ShieldAlert, DollarSign, Wallet, CheckCircle2 } from 'lucide-react';

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    subtext: string;
    colorClass: string;
    delay: number;
}

const StatCard: React.FC<StatCardProps> = ({icon: Icon, title, value, subtext, colorClass, delay}) => (
    <div
        className="bg-white p-5 lg:p-6 rounded-2xl border border-[#A09BAD]/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
        style={{animation: `fadeIn 0.5s ease-out ${delay}s backwards`}}>
        <div className={`p-3 lg:p-4 rounded-xl ${colorClass} text-white shadow-md flex-shrink-0`}>
            <Icon className="w-5 h-5 lg:w-6 lg:h-6"/>
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#71728B] uppercase tracking-wider mb-1 truncate">{title}</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-[#131427] tracking-tight truncate"
                title={String(value)}>{value}</h3>
            <p className="text-xs text-[#51536D] mt-1 font-medium truncate">{subtext}</p>
        </div>
    </div>
);

interface StatCardsProps {
    stats: {
        critical: number;
        totalBudget: number;
        spentAmount: number;
        fundsRequired: number;
    };
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0
    }).format(amount);
};

const StatCards: React.FC<StatCardsProps> = ({ stats }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard delay={0.1} icon={ShieldAlert} title="Critiques" value={stats.critical}
                  subtext="Tâches bloquantes" colorClass="bg-[#2F3151]"/>
        <StatCard delay={0.2} icon={DollarSign} title="Budget Total"
                  value={formatCurrency(stats.totalBudget)} subtext="Estimation coûts"
                  colorClass="bg-[#51536D]"/>
        <StatCard delay={0.3} icon={Wallet} title="Déjà Payé" value={formatCurrency(stats.spentAmount)}
                  subtext="Sortie de caisse" colorClass="bg-[#131427]"/>
        <StatCard delay={0.4} icon={CheckCircle2} title="Fonds Requis"
                  value={formatCurrency(stats.fundsRequired)} subtext="Épargne bloquée"
                  colorClass="bg-[#71728B]"/>
    </div>
);

export default StatCards;
