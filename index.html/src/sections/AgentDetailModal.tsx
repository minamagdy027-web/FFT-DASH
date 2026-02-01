import type { Agent } from '@/types';
import { X, Mail, User, Briefcase, Award, Star, Calendar, Target, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface AgentDetailModalProps {
  agent: Agent | null;
  open: boolean;
  onClose: () => void;
}

export function AgentDetailModal({ agent, open, onClose }: AgentDetailModalProps) {
  if (!agent) return null;

  const caseTypes = [
    { key: '1g_sch', label: '1G SCH', value: agent.cases['1g_sch'] },
    { key: 'auto', label: 'Auto', value: agent.cases['auto'] },
    { key: 'check_in', label: 'Check In', value: agent.cases['check_in'] },
    { key: 'dmc', label: 'DMC', value: agent.cases['dmc'] },
    { key: 'expired_payment', label: 'Expired Payment', value: agent.cases['expired_payment'] },
    { key: 'failed', label: 'Failed', value: agent.cases['failed'] },
    { key: 'manual', label: 'Manual', value: agent.cases['manual'] },
    { key: 'refund_others', label: 'Refund Others', value: agent.cases['refund_others'] },
    { key: 'reissue_refunds', label: 'Reissue/Refunds', value: agent.cases['reissue_refunds'] },
    { key: 'sch', label: 'SCH', value: agent.cases['sch'] },
    { key: 'wa_sch', label: 'WA SCH', value: agent.cases['wa_sch'] },
  ].filter(c => c.value > 0).sort((a, b) => b.value - a.value);

  const getPerformanceColor = (newPct: number) => {
    if (newPct >= 1.4) return 'text-emerald-600 dark:text-emerald-400';
    if (newPct >= 1.2) return 'text-blue-600 dark:text-blue-400';
    if (newPct >= 1.0) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getPerformanceBg = (newPct: number) => {
    if (newPct >= 1.4) return 'bg-emerald-100 dark:bg-emerald-900/30';
    if (newPct >= 1.2) return 'bg-blue-100 dark:bg-blue-900/30';
    if (newPct >= 1.0) return 'bg-amber-100 dark:bg-amber-900/30';
    return 'bg-rose-100 dark:bg-rose-900/30';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30">
              {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-white">{agent.name}</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-4 mt-3 text-blue-100">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {agent.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {agent.tl}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Badge */}
          <div className="absolute bottom-4 right-8">
            <div className={`px-4 py-2 rounded-full ${getPerformanceBg(agent.new_pct)} ${getPerformanceColor(agent.new_pct)} font-bold text-lg`}>
              New %: {agent.new_pct.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={Briefcase}
              label="Total Cases"
              value={agent.total_cases.toLocaleString()}
              color="text-blue-600 dark:text-blue-400"
            />
            <MetricCard
              icon={Star}
              label="Achieved Points"
              value={Math.round(agent.achieved_points).toLocaleString()}
              color="text-amber-600 dark:text-amber-400"
            />
            <MetricCard
              icon={Award}
              label="Quality Score"
              value={`${agent.quality.average_final_pct.toFixed(1)}%`}
              color="text-emerald-600 dark:text-emerald-400"
            />
            <MetricCard
              icon={Zap}
              label="Avg Cases/Day"
              value={agent.avg_cases_per_day.toFixed(0)}
              color="text-purple-600 dark:text-purple-400"
            />
          </div>

          <Separator className="my-6" />

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Work Stats */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Work Statistics
              </h4>
              <div className="space-y-4">
                <StatRow label="Work Days" value={agent.work_days.toFixed(0)} />
                <StatRow label="Total Points" value={Math.round(agent.total_points).toLocaleString()} />
                <StatRow label="Support Points" value={Math.round(agent.support_points).toLocaleString()} />
                <StatRow label="New KPI %" value={`${(agent.new_kpi_pct * 100).toFixed(0)}%`} />
              </div>
            </div>

            {/* Quality & SLA */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Quality & SLA
              </h4>
              <div className="space-y-4">
                <StatRow label="Quality Records" value={agent.quality.record_count.toString()} />
                <StatRow label="Quality %" value={`${(agent.quality.percentage * 100).toFixed(1)}%`} />
                <StatRow label="SLA Avg Duration" value={`${agent.sla.avg_duration.toFixed(1)} min`} />
                <StatRow label="SLA %" value={`${(agent.sla.percentage * 100).toFixed(2)}%`} />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Case Breakdown */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              Case Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {caseTypes.map((caseType) => (
                <div
                  key={caseType.key}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{caseType.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{caseType.value.toLocaleString()}</p>
                  <div className="mt-2">
                    <Progress
                      value={(caseType.value / agent.total_cases) * 100}
                      className="h-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lateness Info */}
          {agent.lateness.count_lateness > 0 && (
            <>
              <Separator className="my-6" />
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">Lateness Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatRow label="Total Lateness (min)" value={agent.lateness.sum_lateness.toString()} />
                  <StatRow label="Late Instances" value={agent.lateness.count_lateness.toString()} />
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
