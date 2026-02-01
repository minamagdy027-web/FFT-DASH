import { useNavigate } from 'react-router-dom';
import type { Agent } from '@/types';
import { Mail, Briefcase, TrendingUp, Award, Star, User, ChevronRight } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  rank: number;
}

export function AgentCard({ agent, rank }: AgentCardProps) {
  const navigate = useNavigate();

  // Determine rank color
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-amber-400 to-amber-600';
    if (rank === 2) return 'from-slate-300 to-slate-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-500 to-indigo-600';
  };

  // Determine performance badge
  const getPerformanceBadge = (newPct: number) => {
    if (newPct >= 1.4) return { label: 'Excellent', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
    if (newPct >= 1.2) return { label: 'Good', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    if (newPct >= 1.0) return { label: 'Average', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
    return { label: 'Needs Improvement', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' };
  };

  const performance = getPerformanceBadge(agent.new_pct);
  const rankColor = getRankColor(rank);

  const handleClick = () => {
    navigate(`/agent/${encodeURIComponent(agent.name)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Rank Badge */}
      <div className={`absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-br ${rankColor} flex items-center justify-center shadow-lg z-10`}>
        <span className="text-white font-bold text-sm">#{rank}</span>
      </div>

      {/* Performance Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${performance.color}`}>
          {performance.label}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-6 pt-16">
        {/* Avatar & Name */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
            {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1" title={agent.name}>
            {agent.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-1">
            <Mail className="w-3 h-3" />
            <span className="truncate max-w-[200px]">{agent.email}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs">New %</span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {agent.new_pct.toFixed(2)}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="text-xs">Cases</span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {agent.total_cases.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span className="text-xs">Quality</span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {agent.quality.average_final_pct.toFixed(0)}%
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
              <Star className="w-3.5 h-3.5" />
              <span className="text-xs">Points</span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {Math.round(agent.achieved_points).toLocaleString()}
            </p>
          </div>
        </div>

        {/* SF Lateness Warning */}
        {agent.sf_lateness.lateness_minutes > 0 && (
          <div className="mb-4 px-3 py-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800">
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
              SF Lateness: {agent.sf_lateness.lateness_minutes} min
            </p>
          </div>
        )}

        {/* TL & View More */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <User className="w-4 h-4" />
            <span className="truncate max-w-[120px]">{agent.tl}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            View Details
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
