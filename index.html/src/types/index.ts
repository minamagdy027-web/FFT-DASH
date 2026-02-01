export interface AgentCases {
  '1g_sch': number;
  'auto': number;
  'check_in': number;
  'dmc': number;
  'expired_payment': number;
  'failed': number;
  'manual': number;
  'refund_others': number;
  'reissue_refunds': number;
  'sch': number;
  'wa_sch': number;
}

export interface AgentQuality {
  average_final_pct: number;
  record_count: number;
  percentage: number;
}

export interface AgentSLA {
  avg_duration: number;
  percentage: number;
}

export interface AgentLateness {
  sum_lateness: number;
  count_lateness: number;
}

export interface AgentSFLateness {
  lateness_minutes: number;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  tl: string;
  new_pct: number;
  new_kpi_pct: number;
  total_cases: number;
  total_points: number;
  achieved_points: number;
  support_points: number;
  work_days: number;
  avg_cases_per_day: number;
  cases: AgentCases;
  quality: AgentQuality;
  sla: AgentSLA;
  lateness: AgentLateness;
  sf_lateness: AgentSFLateness;
}

export interface TeamStats {
  total_agents: number;
  total_cases: number;
  total_points: number;
  avg_quality: number;
  top_performer: string;
  top_performer_new_pct: number;
  total_tls: number;
}
