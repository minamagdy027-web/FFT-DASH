import type { Agent } from '@/types';
import { Users, Award, Star, Target, Crown, TrendingUp } from 'lucide-react';

interface TLPerformanceProps {
  agents: Agent[];
  tls: string[];
}

interface TLStats {
  name: string;
  agentCount: number;
  totalCases: number;
  avgQuality: number;
  totalPoints: number;
  topAgent: string;
  topAgentNewPct: number;
}

export function TLPerformance({ agents, tls }: TLPerformanceProps) {
  // Calculate stats per TL
  const tlStats: TLStats[] = tls.map(tl => {
    const tlAgents = agents.filter(a => a.tl === tl);
    const topAgent = tlAgents.reduce((max, a) => a.new_pct > max.new_pct ? a : max, tlAgents[0]);
    
    return {
      name: tl,
      agentCount: tlAgents.length,
      totalCases: tlAgents.reduce((sum, a) => sum + a.total_cases, 0),
      avgQuality: tlAgents.reduce((sum, a) => sum + a.quality.average_final_pct, 0) / tlAgents.length,
      totalPoints: tlAgents.reduce((sum, a) => sum + a.achieved_points, 0),
      topAgent: topAgent?.name || '',
      topAgentNewPct: topAgent?.new_pct || 0,
    };
  }).sort((a, b) => b.topAgentNewPct - a.topAgentNewPct);

  const getRankStyle = (rank: number) => {
    if (rank === 0) return 'from-amber-400 to-amber-600 ring-amber-400/50';
    if (rank === 1) return 'from-slate-400 to-slate-600 ring-slate-400/50';
    if (rank === 2) return 'from-orange-400 to-orange-600 ring-orange-400/50';
    return 'from-blue-500 to-indigo-600 ring-blue-500/30';
  };

  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Crown className="w-7 h-7 text-amber-500" />
          Team Lead Leaderboard
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Performance comparison across team leads
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tlStats.map((tl, index) => (
          <div
            key={tl.name}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Rank Badge */}
            <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${getRankStyle(index)} flex items-center justify-center shadow-lg ring-4 ring-opacity-30`}>
              <span className="text-white font-bold text-lg">#{index + 1}</span>
            </div>

            <div className="p-6">
              {/* TL Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tl.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
                    {tl.agentCount} Agents
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Total Cases</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {tl.totalCases.toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs">Avg Quality</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {tl.avgQuality.toFixed(1)}%
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-xs">Total Points</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {Math.round(tl.totalPoints).toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Top New %</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {tl.topAgentNewPct.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Top Agent */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-semibold">Top Performer</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900 dark:text-white truncate pr-4">
                    {tl.topAgent}
                  </p>
                  <span className="px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-sm font-bold">
                    {tl.topAgentNewPct.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
