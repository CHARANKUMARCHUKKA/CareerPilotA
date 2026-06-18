import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  RotateCcw, 
  Users, 
  Database,
  Terminal,
  Activity,
  UserCheck,
  TrendingUp,
  DollarSign,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { User, PlatformStat } from '../types';

interface AdminPanelProps {
  token: string | null;
  onSimulateAdmin: () => void;
  currentUser: User;
}

export default function AdminPanel({ token, onSimulateAdmin, currentUser }: AdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PlatformStat | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Expanded simulated dashboards logic
  const revenueStat = {
    mrr: 14840,
    ltv: 189,
    conversionRate: '4.8%',
    activeTrials: 382
  };

  const errorMonitoring = {
    uptime: '99.98%',
    averageLatency: '124 ms',
    currentRequestsRate: '32 req/s',
    activeServerIncidents: '0 active (Healthy)'
  };

  const aiTokenBreakdown = [
    { service: 'Resume Parsing engine SDK', ratio: 45 },
    { service: 'Interview Voice Speech Coach', ratio: 35 },
    { service: 'Roadmap timeline compilers', ratio: 20 },
  ];

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token || 'default-user'}`
        }
      });
      if (!response.ok) throw new Error('Forbidden');
      const data = await response.json();
      setStats(data.stats);
      setUsers(data.users);
      setAuditLogs(data.auditLogs);
    } catch (err) {
      console.error(err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, [token, currentUser]);

  const isAdmin = currentUser.role === 'admin' || currentUser.email === 'charan21003@gmail.com';

  if (!isAdmin) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-90 w/50 bg-zinc-900/50 border border-zinc-800 max-w-xl mx-auto text-center space-y-6 backdrop-blur" id="admin-panel">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-455 text-rose-450 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Administrator Authorization Required</h2>
          <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Your current credential session holds <span className="text-indigo-400 font-bold">Standard</span> privileges. Only authenticated administrators can access platform revenue, token audits, and server uptime.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-808 border-zinc-800">
          <button
            type="button"
            onClick={onSimulateAdmin}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <UserCheck className="w-4 h-4" /> Elevate Session Role (Simulate Admin)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="admin-panel">
      {/* Header telemetry operations title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 backdrop-blur gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5.5 h-5.5 text-indigo-400" /> SaaS Operational & Revenue Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Audit comprehensive user listings, active product checkouts, real-time token logs, and server performance metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAdminStats}
          className="px-4 py-2 bg-zinc-950 border border-zinc-808 hover:bg-zinc-858 text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-300 animate-spin-slow" /> Force Telemetry Update
        </button>
      </div>

      {loading ? (
        <div className="p-12 rounded-2xl bg-zinc-90 w/10 border border-zinc-800 min-h-[350px] flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-indigo-505 border-zinc-850 animate-spin" />
        </div>
      ) : stats ? (
        <div className="space-y-6">
          
          {/* Dashboard Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            <div className="p-5.5 bg-zinc-900/50 border border-zinc-c800 border-zinc-800 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Aggregate Users</span>
                <span className="text-2xl font-black font-mono text-white mt-1 block">{stats.totalUsers} Registered</span>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="p-5.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">SaaS MRR (Monthly)</span>
                <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">${revenueStat.mrr.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-300 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="p-5.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Total Resume Scans</span>
                <span className="text-2xl font-black font-mono text-white mt- block">{stats.totalResumesAnalyzed} Scans</span>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-300 rounded-lg">
                <Database className="w-4 h-4" />
              </div>
            </div>

            <div className="p-5.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">AI Tokens Used</span>
                <span className="text-2xl font-black font-mono text-amber-400 mt-1 block">{stats.aiTokensUsed.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-300 rounded-lg">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Expanded Columns: Financial Audit, Server Error Rates, AI usage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Financial Performance Overview */}
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Financial Growth Audits
              </h3>
              
              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-550 text-zinc-500">Customer Lifetime Value (LTV):</span>
                  <strong className="text-white font-mono">${revenueStat.ltv}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Free-to-Paid Conversion rate:</span>
                  <strong className="text-emerald-400 font-mono">{revenueStat.conversionRate}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 font-sans">Active Sandbox checkout Trials:</span>
                  <strong className="text-zinc-300 font-mono">{revenueStat.activeTrials}</strong>
                </div>
                <div className="h-1 bg-zinc-950 rounded-full" />
                <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                  Aggregate checkout funnels mapped through simulated Stripe elements routing securely.
                </p>
              </div>
            </div>

            {/* AI Prompts Token Distributions */}
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-1">
                <Cpu className="w-4 h-4 text-indigo-400" /> AI Core Tokens Overhead
              </h3>

              <div className="space-y-3 pt-1">
                {aiTokenBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-zinc-400">{item.service}</span>
                      <strong className="text-zinc-300 font-mono">{item.ratio}%</strong>
                    </div>
                    <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-550 bg-indigo-500 rounded-full" style={{ width: `${item.ratio}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Server Error rates / Health metrics */}
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-[#a855f7] animate-pulse" /> Live Server Diagnostics
              </h3>

              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Continuous Uptime Index:</span>
                  <strong className="text-emerald-400 font-mono">{errorMonitoring.uptime}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Average Core response:</span>
                  <strong className="text-indigo-300 font-mono">{errorMonitoring.averageLatency}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Request Rate (Standard):</span>
                  <strong className="text-white font-mono">{errorMonitoring.currentRequestsRate}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Outstanding Incidents:</span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">{errorMonitoring.activeServerIncidents}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Identity lists */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4">SaaS Identity Registers (User listings)</h3>
              <div className="divide-y divide-zinc-800/80 space-y-3.5">
                {users.map(u => (
                  <div key={u.id} className="pt-3.5 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-zinc-200">{u.name}</div>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase font-black">{u.email}</span>
                    </div>

                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[9px] uppercase ${
                        u.role === 'admin' 
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' 
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {u.role}
                      </span>
                      <span className="px-2 py-0.5 rounded-md border border-zinc-800 bg-zinc-950 font-mono text-[9px] text-zinc-400 uppercase">
                        {u.subscription} Plan
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit terminal logs */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest font-mono flex items-center gap-1 pb-1 border-b border-zinc-808 border-zinc-800">
                  <Terminal className="w-3.5 h-3.5 animate-pulse" /> Platform Security Logs
                </span>
                
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mt-4 font-mono text-[10px] text-zinc-400 space-y-3.5 max-h-[220px] overflow-y-auto leading-relaxed">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <span className="text-indigo-400 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <strong className="text-indigo-300 select-none whitespace-nowrap uppercase">{log.action}:</strong>
                      <span className="text-zinc-455 text-zinc-400 break-all">{log.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center text-zinc-400 text-xs">
          An error occurred attempting to load admin telemetry dashboard. Check token specs.
        </div>
      )}
    </div>
  );
}
