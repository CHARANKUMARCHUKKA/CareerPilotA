import React, { useState } from 'react';
import { 
  Github, 
  Sparkles, 
  TrendingUp, 
  GitCommit, 
  GitPullRequest, 
  CheckCircle, 
  Code, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Cpu
} from 'lucide-react';

interface GitHubAnalyzerProps {
  token: string | null;
}

export default function GitHubAnalyzer({ token }: GitHubAnalyzerProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<any | null>({
    username: 'charan21003',
    portfolioScore: 84,
    repoQualityScore: 89,
    commitActivity: [32, 45, 29, 64, 52, 78, 61, 95, 87, 110, 98, 120],
    radar: [
      { name: 'TypeScript', value: 88, color: 'bg-indigo-500' },
      { name: 'React/Vite', value: 92, color: 'bg-teal-500' },
      { name: 'Node.js', value: 85, color: 'bg-emerald-500' },
      { name: 'Tailwind CSS', value: 78, color: 'bg-pink-500' },
      { name: 'PostgreSQL', value: 65, color: 'bg-sky-500' }
    ],
    qualityAudit: [
      { metric: 'Modular Architecture', score: 95, desc: 'Logical directory segregation aligning with corporate standards.' },
      { metric: 'Documentation & Readme', score: 88, desc: 'Clean, professional installation notes with direct environment keys explanations.' },
      { metric: 'Type Safety Coverage', score: 90, desc: 'Pristine custom type declarations with zero usage of the open "any" identifier.' },
      { metric: 'Testing & Integrity', score: 55, desc: 'Vulnerable branch coverage lacking unit validations.' },
    ],
    suggestions: [
      'Implement mock data seed fixtures with dynamic test suites using Jest/Vitest.',
      'Containerize your application entrypoint using streamlined Docker definitions to improve deploy rating.',
      'Add semantic versioning tags to your git commit logs using Conventional Commits templates.'
    ]
  });

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setLoading(true);
    setTimeout(() => {
      // Simulate highly optimized new report based on inputs
      setActiveAnalysis({
        username: repoUrl.split('github.com/')[1]?.split('/')[0] || 'candidate-dev',
        portfolioScore: Math.floor(Math.random() * 20) + 78,
        repoQualityScore: Math.floor(Math.random() * 15) + 82,
        commitActivity: Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 40),
        radar: [
          { name: 'TypeScript', value: Math.floor(Math.random() * 15) + 80, color: 'bg-indigo-500' },
          { name: 'React/Vite', value: Math.floor(Math.random() * 15) + 82, color: 'bg-teal-500' },
          { name: 'Node.js', value: Math.floor(Math.random() * 20) + 75, color: 'bg-emerald-500' },
          { name: 'Docker / YAML', value: Math.floor(Math.random() * 30) + 60, color: 'bg-amber-500' },
          { name: 'Tailwind CSS', value: Math.floor(Math.random() * 20) + 75, color: 'bg-pink-500' }
        ],
        qualityAudit: [
          { metric: 'Modular Architecture', score: Math.floor(Math.random() * 10) + 90, desc: 'Pristine separation of concerns between client widgets and routes.' },
          { metric: 'Documentation & Readme', score: Math.floor(Math.random() * 20) + 75, desc: 'Rich explanation of server configuration paradigms.' },
          { metric: 'Type Safety Coverage', score: Math.floor(Math.random() * 15) + 80, desc: 'Strict interface implementation across all routing interfaces.' },
          { metric: 'Testing & Integrity', score: Math.floor(Math.random() * 40) + 50, desc: 'Requires integration controls on active mock controllers.' },
        ],
        suggestions: [
          'Eliminate standard hardcoded strings and integrate runtime .env structure.',
          'Formulate strict workflow validation files via GitHub Actions CI/CD.',
          'Optimize bundled image assets to streamline initial network payload sizes.'
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="github-analyzer">
      <div className="flex justify-between items-center bg-zinc-90 w bg-zinc-900/40 p-6 rounded-2xl border border-zinc-850 border-zinc-800 backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Github className="w-5.5 h-5.5 text-indigo-400" /> AI GitHub Analyzer Pro
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Connect live GitHub repositories to scan formatting quality, technological radar diversity, and commit velocity.
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/25 rounded-lg text-[10px] font-mono tracking-wider text-indigo-300 font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Recruiter Grade
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Connection console */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4 backdrop-blur">
          <h3 className="text-sm font-semibold text-zinc-200">Repository Connector</h3>
          
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repo-url" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400">GitHub Repo URL</label>
              <input
                id="repo-url"
                type="text"
                placeholder="e.g. github.com/charan21003/career-pilot"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-xs py-2.5 px-3.5 focus:outline-none focus:border-indigo-500 text-zinc-200 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !repoUrl.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              Connect & Analyze Repo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-2">
            <div className="font-bold text-zinc-300 uppercase leading-none font-mono text-[9px] tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Premium Connective Sandbox
            </div>
            <p className="leading-relaxed">
              We compile code structure telemetry instantly to test against standard enterprise design frameworks.
            </p>
          </div>
        </div>

        {/* Right Side: Analysis Display */}
        <div className="lg:col-span-8 relative">
          {loading && (
            <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur z-20 flex flex-col items-center justify-center rounded-2xl text-center p-6">
              <div className="w-9 h-9 rounded-full border-2 border-t-indigo-550 border-t-indigo-500 border-zinc-800 animate-spin" />
              <p className="text-xs text-zinc-300 font-semibold mt-4 animate-pulse">
                Parsing commit trees and technology stack radars...
              </p>
            </div>
          )}

          {activeAnalysis ? (
            <div className="space-y-6">
              {/* Gauges header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Score gauge text */}
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Portfolio Match Index</span>
                    <h4 className="text-3xl font-black text-white font-mono">{activeAnalysis.portfolioScore}%</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3" /> Ready for job applications
                    </span>
                  </div>
                  
                  {/* SVG Gauge */}
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#27272a" strokeWidth="4" fill="transparent" />
                      <circle cx="32" cy="32" r="26" stroke="#6366f1" strokeWidth="4" fill="transparent" 
                        strokeDasharray={163.3}
                        strokeDashoffset={163.3 - (163.3 * activeAnalysis.portfolioScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-zinc-300">
                      {activeAnalysis.portfolioScore}%
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Repository Quality Score</span>
                    <h4 className="text-3xl font-black text-white font-mono">{activeAnalysis.repoQualityScore}%</h4>
                    <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> Top 15% of active students
                    </span>
                  </div>

                  {/* SVG Gauge */}
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#27272a" strokeWidth="4" fill="transparent" />
                      <circle cx="32" cy="32" r="26" stroke="#10b981" strokeWidth="4" fill="transparent" 
                        strokeDasharray={163.3}
                        strokeDashoffset={163.3 - (163.3 * activeAnalysis.repoQualityScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-zinc-300">
                      {activeAnalysis.repoQualityScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Commit Velocity graph chart widget */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-1">
                    <GitCommit className="w-4 h-4 text-emerald-400" /> Git Commit Velocity Graph
                  </h4>
                  <p className="text-[10px] text-zinc-500">Trailing 12-week development commit volume representation.</p>
                </div>

                <div className="h-28 flex items-end justify-between gap-1.5 pt-4">
                  {activeAnalysis.commitActivity.map((count: number, idx: number) => {
                    const maxHeight = 80;
                    const heightPercent = Math.min(100, Math.round((count / Math.max(...activeAnalysis.commitActivity)) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        <div 
                          className="w-full bg-indigo-500/10 border border-indigo-400/20 group-hover:bg-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/20 rounded-t transition-all duration-300"
                          style={{ height: `${(heightPercent * maxHeight) / 100}px` }}
                        />
                        
                        {/* Tooltip */}
                        <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-zinc-950 border border-indigo-500/30 text-[9px] font-mono text-indigo-300 px-1.5 py-0.5 rounded shadow z-10 transition-transform pointer-events-none whitespace-nowrap">
                          {count} Commits
                        </div>
                        
                        <span className="text-[8px] font-mono font-bold text-zinc-550 text-zinc-500 mt-2">W{idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Languages / Technology Radar & Quality audit logs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-3.5">
                  <h5 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-widest flex items-center gap-1">
                    <Cpu className="w-4 h-4 text-indigo-400" /> Technology Radar
                  </h5>
                  
                  <div className="space-y-2 pt-2">
                    {activeAnalysis.radar.map((skill: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                          <span>{skill.name}</span>
                          <strong className="text-zinc-200">{skill.value}%</strong>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden flex">
                          <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-3">
                  <h5 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-emerald-400" /> Code Quality Audit
                  </h5>

                  <div className="space-y-2.5 pt-1">
                    {activeAnalysis.qualityAudit.map((audit: any, idx: number) => (
                      <div key={idx} className="text-[11px] leading-relaxed">
                        <div className="flex justify-between items-center text-zinc-300 font-semibold font-mono text-[10px]">
                          <span>{audit.metric}</span>
                          <span className={audit.score >= 80 ? 'text-emerald-400' : 'text-rose-400'}>
                            {audit.score}%
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{audit.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions Section */}
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 backdrop-blur space-y-3">
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-indigo-400 font-mono flex items-center gap-1">
                  <Sparkles className="w-4 h-4 animate-pulse" /> Actionable GitHub Portfolio Suggestions
                </span>
                
                <ul className="space-y-2">
                  {activeAnalysis.suggestions.map((sug: string, idx: number) => (
                    <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2.5 leading-relaxed">
                      <span className="px-1.5 py-0.5 bg-indigo-500/15 text-indigo-400 text-[9px] font-bold font-mono rounded mt-0.5">STEP {idx + 1}</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-zinc-90 w/10 border border-zinc-800 flex flex-col items-center justify-center text-center min-h-[350px]">
              <Github className="w-12 h-12 text-zinc-700 mb-4 animate-bounce" />
              <h4 className="font-semibold text-white">No active GitHub repository connected</h4>
              <p className="text-xs text-zinc-500 max-w-sm mt-1 leading-relaxed">
                Enter your project's GitHub URL in the container input panel to trigger AI architecture scans.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
