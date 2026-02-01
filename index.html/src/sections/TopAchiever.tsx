import type { Agent } from '@/types';
import { Crown, TrendingUp, Award, Zap } from 'lucide-react';

interface TopAchieverProps {
  agent: Agent | null;
}

export function TopAchiever({ agent }: TopAchieverProps) {
  if (!agent) return null;

  return (
    <section className="py-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-0.5">
        <div className="relative rounded-[14px] bg-white dark:bg-slate-900 px-6 py-4">
          <div className="flex items-center gap-6">
            {/* Crown Icon */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                  Top Achiever
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {agent.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {agent.tl}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 mb-0.5">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">New %</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {agent.new_pct.toFixed(2)}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 mb-0.5">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-medium">Quality</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {agent.quality.average_final_pct.toFixed(0)}%
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 mb-0.5">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium">Cases</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {agent.total_cases.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
