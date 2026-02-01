/**
 * Google Sheets Integration for FFT Dashboard
 * 
 * This file contains the Google Apps Script code that should be deployed
 * as a web app to enable live data updates from Google Sheets.
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste the script below
 * 4. Deploy as a web app (Deploy > New deployment > Web app)
 * 5. Set access to "Anyone"
 * 6. Copy the web app URL
 * 7. Update the SHEET_URL constant in your dashboard
 */

// ============================================
// GOOGLE APPS SCRIPT CODE (Paste in Apps Script)
// ============================================

/*
function doGet(e) {
  // Enable CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Get sheet data
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  
  const data = {
    last_updated: new Date().toISOString(),
    agents: [],
    team_stats: {},
    tls: []
  };
  
  // Process each sheet
  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    const values = sheet.getDataRange().getValues();
    
    // Process based on sheet name
    if (sheetName === 'Occupancy ') {
      data.agents = processOccupancySheet(values);
    }
  });
  
  // Calculate team stats
  data.team_stats = calculateTeamStats(data.agents);
  data.tls = [...new Set(data.agents.map(a => a.tl).filter(Boolean))];
  
  output.setContent(JSON.stringify(data));
  return output;
}

function processOccupancySheet(values) {
  const agents = [];
  const headers = values[0];
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const agentName = row[0];
    
    if (!agentName || agentName === 'Agent Name' || agentName.includes('Unnamed')) {
      continue;
    }
    
    const newPct = parseFloat(row[19]) || 0;
    if (newPct === 0 && !row[12]) continue;
    
    agents.push({
      id: i,
      name: agentName,
      email: '', // Will be populated from Names sheet
      tl: row[21] || '',
      new_pct: newPct,
      new_kpi_pct: parseFloat(row[20]) || 0,
      total_cases: parseInt(row[12]) || 0,
      total_points: parseFloat(row[13]) || 0,
      achieved_points: parseFloat(row[15]) || 0,
      support_points: parseFloat(row[14]) || 0,
      work_days: parseFloat(row[16]) || 0,
      avg_cases_per_day: parseFloat(row[17]) || 0,
      cases: {
        '1g_sch': parseInt(row[1]) || 0,
        'auto': parseInt(row[2]) || 0,
        'check_in': parseInt(row[3]) || 0,
        'dmc': parseInt(row[4]) || 0,
        'expired_payment': parseInt(row[5]) || 0,
        'failed': parseInt(row[6]) || 0,
        'manual': parseInt(row[7]) || 0,
        'refund_others': parseInt(row[8]) || 0,
        'reissue_refunds': parseInt(row[9]) || 0,
        'sch': parseInt(row[10]) || 0,
        'wa_sch': parseInt(row[11]) || 0,
      },
      quality: { average_final_pct: 0, record_count: 0, percentage: 0 },
      sla: { avg_duration: 0, percentage: 0 },
      lateness: { sum_lateness: 0, count_lateness: 0 },
      sf_lateness: { lateness_minutes: 0 }
    });
  }
  
  return agents.sort((a, b) => b.new_pct - a.new_pct);
}

function calculateTeamStats(agents) {
  return {
    total_agents: agents.length,
    total_cases: agents.reduce((sum, a) => sum + a.total_cases, 0),
    total_points: agents.reduce((sum, a) => sum + a.achieved_points, 0),
    avg_quality: agents.reduce((sum, a) => sum + a.quality.average_final_pct, 0) / 
                 agents.filter(a => a.quality.average_final_pct > 0).length || 0,
    top_performer: agents[0]?.name || '',
    top_performer_new_pct: agents[0]?.new_pct || 0,
    total_tls: new Set(agents.map(a => a.tl).filter(Boolean)).size
  };
}
*/

// ============================================
// FRONTEND INTEGRATION
// ============================================

/**
 * To enable Google Sheets integration in your dashboard:
 * 
 * 1. Deploy the Google Apps Script above as a web app
 * 2. Get the web app URL
 * 3. Update the useAgents hook to fetch from the Google Sheets URL
 * 
 * Example useAgents.ts modification:
 * 
 * const GOOGLE_SHEETS_URL = 'YOUR_WEB_APP_URL_HERE';
 * 
 * // In the fetchData function:
 * const response = await fetch(GOOGLE_SHEETS_URL);
 * const data = await response.json();
 * 
 * setAgents(data.agents);
 * setTeamStats(data.team_stats);
 * setTls(data.tls);
 * setLastUpdated(data.last_updated);
 */

// Export for documentation
window.GoogleSheetsIntegration = {
  version: '1.0.0',
  description: 'Google Sheets live integration for FFT Dashboard'
};
