import { useState, useMemo } from 'react';
import type { Agent } from '@/types';
import { AgentCard } from './AgentCard';
import { Search, Filter, Users, TrendingUp, Award, Star, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AgentGridProps {
  agents: Agent[];
  tls: string[];
}

export function AgentGrid({ agents, tls }: AgentGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTL, setSelectedTL] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('new_pct');

  // Filter and sort agents
  const filteredAgents = useMemo(() => {
    let result = [...agents];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(agent =>
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.tl.toLowerCase().includes(query)
      );
    }

    // Filter by TL
    if (selectedTL && selectedTL !== 'all') {
      result = result.filter(agent => agent.tl === selectedTL);
    }

    // Sort
    switch (sortBy) {
      case 'new_pct':
        result.sort((a, b) => b.new_pct - a.new_pct);
        break;
      case 'cases':
        result.sort((a, b) => b.total_cases - a.total_cases);
        break;
      case 'quality':
        result.sort((a, b) => b.quality.average_final_pct - a.quality.average_final_pct);
        break;
      case 'points':
        result.sort((a, b) => b.achieved_points - a.achieved_points);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [agents, searchQuery, selectedTL, sortBy]);

  // Calculate stats for filtered agents
  const filteredStats = useMemo(() => {
    if (filteredAgents.length === 0) return null;
    return {
      count: filteredAgents.length,
      avgNewPct: filteredAgents.reduce((sum, a) => sum + a.new_pct, 0) / filteredAgents.length,
      totalCases: filteredAgents.reduce((sum, a) => sum + a.total_cases, 0),
      avgQuality: filteredAgents.reduce((sum, a) => sum + a.quality.average_final_pct, 0) / filteredAgents.length,
    };
  }, [filteredAgents]);

  return (
    <section className="py-8">
      {/* Search Bar - Top Left */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Search - Top Left */}
          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or team lead..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* TL Filter */}
            <Select value={selectedTL} onValueChange={setSelectedTL}>
              <SelectTrigger className="h-12 w-full sm:w-44">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filter by TL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team Leads</SelectItem>
                {tls.map(tl => (
                  <SelectItem key={tl} value={tl}>{tl}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 w-full sm:w-44">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_pct">New % (High to Low)</SelectItem>
                <SelectItem value="cases">Total Cases</SelectItem>
                <SelectItem value="quality">Quality Score</SelectItem>
                <SelectItem value="points">Achieved Points</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtered Stats */}
        {filteredStats && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">Showing:</span>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {filteredStats.count} agents
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Avg New %: {filteredStats.avgNewPct.toFixed(2)}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Avg Quality: {filteredStats.avgQuality.toFixed(1)}%
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              Total Cases: {filteredStats.totalCases.toLocaleString()}
            </Badge>
          </div>
        )}
      </div>

      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-purple-500" />
          Agent Performance
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Click on any agent card to view detailed performance metrics
        </p>
      </div>

      {/* Agents Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent, index) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              rank={index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No agents found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </section>
  );
}
