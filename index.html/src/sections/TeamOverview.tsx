import type { TeamStats } from '@/types';
import { Users, Briefcase, Trophy, Award, TrendingUp } from 'lucide-react';

interface TeamOverviewProps {
  stats: TeamStats | null;
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number; 
  subValue?: string;
  color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subValue && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
}

export function TeamOverview({ stats }: TeamOverviewProps) {
  if (!stats) return null;

  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-blue-500" />
          Team Performance Overview
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Real-time insights into team metrics and performance indicators
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Total Agents"
          value={stats.total_agents}
          subValue={`${stats.total_tls} Team Leads`}
          color="bg-blue-500"
        />
        <StatCard
          icon={Briefcase}
          label="Total Cases"
          value={stats.total_cases.toLocaleString()}
          subValue="All time"
          color="bg-emerald-500"
        />
        <StatCard
          icon={Trophy}
          label="Total Points"
          value={Math.round(stats.total_points).toLocaleString()}
          subValue="Achieved"
          color="bg-amber-500"
        />
        <StatCard
          icon={Award}
          label="Avg Quality"
          value={`${stats.avg_quality.toFixed(1)}%`}
          subValue="Quality score"
          color="bg-rose-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Top Performer"
          value={stats.top_performer_new_pct.toFixed(2)}
          subValue={stats.top_performer.split(' ').slice(0, 2).join(' ')}
          color="bg-cyan-500"
        />
      </div>
    </section>
  );
}
