import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAgents } from '@/hooks/useAgents';
import { Header } from '@/sections/Header';
import { TeamOverview } from '@/sections/TeamOverview';
import { TopAchiever } from '@/sections/TopAchiever';
import { AgentGrid } from '@/sections/AgentGrid';
import { TLPerformance } from '@/sections/TLPerformance';
import { Footer } from '@/sections/Footer';
import { AgentDetailPage } from '@/pages/AgentDetailPage';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';

function Dashboard() {
  const { agents, teamStats, tls, lastUpdated, loading, error } = useAgents();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-rose-500" />
          <p className="text-slate-900 dark:text-white font-semibold mb-2">Error loading dashboard</p>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const topAchiever = agents.length > 0 ? agents[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header lastUpdated={lastUpdated} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Team Overview */}
        <TeamOverview stats={teamStats} />
        
        {/* Top Achiever */}
        <TopAchiever agent={topAchiever} />
        
        {/* TL Performance */}
        <TLPerformance agents={agents} tls={tls} />
        
        {/* Agent Grid */}
        <AgentGrid agents={agents} tls={tls} />
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agent/:agentName" element={<AgentDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
