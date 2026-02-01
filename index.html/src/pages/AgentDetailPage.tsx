import { useParams, useNavigate } from 'react-router-dom';
import { useAgents } from '@/hooks/useAgents';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Footer } from '@/sections/Footer';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, ArrowLeft, Mail, User, Briefcase, Award, Star, Calendar, Target, Zap, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export function AgentDetailPage() {
  const { agentName } = useParams<{ agentName: string }>();
  const navigate = useNavigate();
  const { agents, loading, error } = useAgents();

  // Find agent by name (decode URL parameter)
  const decodedName = decodeURIComponent(agentName || '');
  const agent = agents.find(a => a.name === decodedName);

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <Spinner className="w-12 h-12 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading agent details...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (error || !agent) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-rose-500" />
            <p className="text-slate-900 dark:text-white font-semibold mb-2">Agent not found</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

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
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Custom Header for Agent Page */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">FFT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Agent Details
                </h1>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white mb-8">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-2 border-white/30">
                {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-3">{agent.name}</h1>
                <div className="flex items-center gap-6 text-blue-100">
                  <span className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {agent.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {agent.tl}
                  </span>
                </div>
              </div>
              <div className={`px-6 py-3 rounded-full ${getPerformanceBg(agent.new_pct)} ${getPerformanceColor(agent.new_pct)} font-bold text-2xl`}>
                New %: {agent.new_pct.toFixed(2)}
              </div>
            </div>
          </div>

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

          <Separator className="my-8" />

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Work Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Work Statistics
              </h4>
              <div className="space-y-3">
                <StatRow label="Work Days" value={agent.work_days.toFixed(0)} />
                <StatRow label="Total Points" value={Math.round(agent.total_points).toLocaleString()} />
                <StatRow label="Support Points" value={Math.round(agent.support_points).toLocaleString()} />
                <StatRow label="New KPI %" value={`${(agent.new_kpi_pct * 100).toFixed(0)}%`} />
              </div>
            </div>

            {/* Quality & SLA */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Quality & SLA
              </h4>
              <div className="space-y-3">
                <StatRow label="Quality Records" value={agent.quality.record_count.toString()} />
                <StatRow label="Quality %" value={`${(agent.quality.percentage * 100).toFixed(1)}%`} />
                <StatRow label="SLA Avg Duration" value={`${agent.sla.avg_duration.toFixed(1)} min`} />
                <StatRow label="SLA %" value={`${(agent.sla.percentage * 100).toFixed(2)}%`} />
              </div>
            </div>

            {/* Lateness Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" />
                Lateness Information
              </h4>
              <div className="space-y-3">
                <StatRow 
                  label="Lateness (Sum)" 
                  value={agent.lateness.sum_lateness > 0 ? `${agent.lateness.sum_lateness} min` : '-'} 
                  highlight={agent.lateness.sum_lateness > 0}
                />
                <StatRow 
                  label="Late Instances" 
                  value={agent.lateness.count_lateness > 0 ? agent.lateness.count_lateness.toString() : '-'} 
                  highlight={agent.lateness.count_lateness > 0}
                />
                <StatRow 
                  label="SF Lateness" 
                  value={agent.sf_lateness.lateness_minutes > 0 ? `${agent.sf_lateness.lateness_minutes} min` : '-'} 
                  highlight={agent.sf_lateness.lateness_minutes > 0}
                />
              </div>
              
              {(agent.lateness.sum_lateness > 0 || agent.sf_lateness.lateness_minutes > 0) && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Lateness recorded</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Case Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              Case Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {caseTypes.map((caseType) => (
                <div
                  key={caseType.key}
                  className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{caseType.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{caseType.value.toLocaleString()}</p>
                  <div className="mt-2">
                    <Progress
                      value={(caseType.value / agent.total_cases) * 100}
                      className="h-1.5"
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {((caseType.value / agent.total_cases) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

function MetricCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function StatRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
        {value}
      </span>
    </div>
  );
}
