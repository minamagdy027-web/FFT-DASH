import { useState, useEffect } from 'react';
import type { Agent, TeamStats } from '@/types';

// ============================================
// GOOGLE SHEETS INTEGRATION
// ============================================
// To enable live updates from Google Sheets:
// 1. Deploy the Google Apps Script from /data/google-sheets-integration.js
// 2. Replace the empty string below with your web app URL
// 3. Set useGoogleSheets to true
// ============================================
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxJTphhzJwjBognwJiPc8Ogt5vsZLv7vaQIbOajo5VLn_X3afXOS3vXgRB-YcDKtlWy/exec'; // e.g., 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
const USE_GOOGLE_SHEETS = true;

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [tls, setTls] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if Google Sheets integration is enabled
        if (USE_GOOGLE_SHEETS && GOOGLE_SHEETS_URL) {
          // Fetch from Google Sheets
          const response = await fetch(GOOGLE_SHEETS_URL);
          if (!response.ok) throw new Error('Failed to fetch from Google Sheets');
          
          const data = await response.json();
          setAgents(data.agents || []);
          setTeamStats(data.team_stats || null);
          setTls(data.tls || []);
          setLastUpdated(data.last_updated || new Date().toISOString());
        } else {
          // Fetch from local JSON files
          const [agentsRes, statsRes, tlsRes, updatedRes] = await Promise.all([
            fetch('/data/agents.json'),
            fetch('/data/team_stats.json'),
            fetch('/data/tls.json'),
            fetch('/data/last_updated.json')
          ]);

          if (!agentsRes.ok || !statsRes.ok || !tlsRes.ok) {
            throw new Error('Failed to fetch data');
          }

          const [agentsData, statsData, tlsData, updatedData] = await Promise.all([
            agentsRes.json(),
            statsRes.json(),
            tlsRes.json(),
            updatedRes.json()
          ]);

          setAgents(agentsData);
          setTeamStats(statsData);
          setTls(tlsData);
          setLastUpdated(updatedData?.last_updated || '');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every 5 minutes if using Google Sheets
    let interval: ReturnType<typeof setInterval>;
    if (USE_GOOGLE_SHEETS && GOOGLE_SHEETS_URL) {
      interval = setInterval(fetchData, 5 * 60 * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return { agents, teamStats, tls, lastUpdated, loading, error };
}
