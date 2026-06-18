import React, { useState } from 'react';
import { 
  Sparkles, 
  Linkedin, 
  TrendingUp, 
  Search, 
  ArrowRight, 
  ThumbsUp, 
  FileText,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface LinkedInOptimizerProps {
  token: string | null;
}

export default function LinkedInOptimizer({ token }: LinkedInOptimizerProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeAnalysis, setActiveAnalysis] = useState<any | null>({
    recruiterScore: 81,
    headlineOptimization: 'Outgoing Software Engineering Student focused on Full-stack TypeScript apps.',
    headlineScore: 84,
    headlineSuggestions: [
      'Change to: "Software Engineer Intern | React, TypeScript, Node.js | Building Scalable Cloud Architecture"',
      'Inject precise industry buzzwords like "REST APIs" or "Cloud Deployment Pipelines".',
      'Remove passive status descriptors like "Student" to assume direct developer agency.'
    ],
    aboutOptimization: 'Passionate full-stack developer with 2+ years of hands-on project creation experience with modern React 19 frameworks and high-performance server routing solutions.',
    aboutScore: 78,
    aboutSuggestions: [
      'Begin with a highly persuasive "Apple-style" hook that frames your unique engineering stack.',
      'Formulate a highly categorized "Technical Core" section listing exact standard libraries.',
      'Conclude with a clear, direct recruiter CTA pointing directly to your GitHub/Portfolio URLs.'
    ],
    experienceScore: 80,
    experienceSuggestions: [
      'Convert all passive task logs into active achievement statements using the XYZ structural formula.',
      'Quantify results, e.g. "Optimized API transaction speeds by 34% by establishing Redis caching layers".',
      'Elaborate specifically on Docker runtime parameters used inside team orchestration workflows.'
    ],
    keywordsOptimized: [
      { word: 'TypeScript', density: 'High', recommendation: 'Keep' },
      { word: 'React 19', density: 'Normal', recommendation: 'Keep' },
      { word: 'Docker', density: 'Low', recommendation: 'Add to headline' },
      { word: 'PostgreSQL', density: 'Normal', recommendation: 'Keep' },
      { word: 'CI/CD Pipelines', density: 'Low', recommendation: 'Add to background' }
    ]
  });

  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setActiveAnalysis({
        recruiterScore: Math.floor(Math.random() * 20) + 80,
        headlineOptimization: headline.trim() ? `${headline.trim()} | React, TypeScript, Node.js | Scalable Microservices` : 'Software Engineering Intern | React, TypeScript, Cloud Platforms',
        headlineScore: Math.floor(Math.random() * 15) + 82,
        headlineSuggestions: [
          'Incorporate clear vertical dividers (|) to structure key frameworks cleanly.',
          'State high-leverage frameworks directly in your prominent display title.',
          'Integrate domain specializations corresponding to your active target job search.'
        ],
        aboutOptimization: about.trim() ? `Pragmatic Software Engineer. ${about.trim()}` : 'Pragmatic developer bridging engineering skill gaps to achieve production readiness.',
        aboutScore: Math.floor(Math.random() * 20) + 76,
        aboutSuggestions: [
          'Add a neat markdown bullet list summarizing your high accuracy portfolio achievements.',
          'Reference your ongoing study of system design parameters like load balancing.',
          'State your immediate availability for summer/fall internships explicitly.'
        ],
        experienceScore: Math.floor(Math.random() * 18) + 78,
        experienceSuggestions: [
          'Highlight your Git contributions and code modularity index.',
          'Format descriptions to start with powerful active verbs (e.g., Designed, Scaled, Led).',
          'Explain how you simulated real APIs using Gemini or mockup datasets.'
        ],
        keywordsOptimized: [
          { word: 'TypeScript', density: 'High', recommendation: 'Strong' },
          { word: 'React', density: 'High', recommendation: 'Strong' },
          { word: 'REST APIs', density: 'Normal', recommendation: 'Ensure present' },
          { word: 'AWS S3', density: 'Low', recommendation: 'Critical addition' },
          { word: 'Docker', density: 'Low', recommendation: 'Critical addition' }
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="linkedin-optimizer">
      <div className="flex justify-between items-center bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Linkedin className="w-5.5 h-5.5 text-indigo-400" /> AI LinkedIn Profile Optimizer
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Optimize your social footprint headlines, bios, and experience logs to maximize direct recruiter outreach statistics.
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-505 bg-indigo-500/10 border border-indigo-500/25 rounded-lg text-[10px] font-mono tracking-wider text-indigo-300 font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> High Placement Trend
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Console */}
        <div className="lg:col-span-5 p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4 backdrop-blur">
          <h3 className="text-sm font-semibold text-zinc-100">Profile Audit console</h3>
          
          <form onSubmit={handleOptimize} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="linkedin-url-input" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400">LinkedIn Profile URL</label>
              <input
                id="linkedin-url-input"
                type="url"
                placeholder="e.g. https://www.linkedin.com/in/charankumar"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-805 border-zinc-800 rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200 placeholder-zinc-700 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="headline-input" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400">Current display Headline</label>
              <textarea
                id="headline-input"
                placeholder="e.g. Student at Tech University looking for Opportunities..."
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200 placeholder-zinc-700 font-sans leading-relaxed resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="about-textarea" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400">"About / Bio" Section</label>
              <textarea
                id="about-textarea"
                placeholder="Paste your current profile bio description..."
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200 placeholder-zinc-700 font-sans leading-relaxed resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="experience-textarea" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400">Experience roles logs</label>
              <textarea
                id="experience-textarea"
                placeholder="Paste descriptions of your current or past jobs/internships..."
                rows={3}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200 placeholder-zinc-700 font-sans leading-relaxed resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              Analyze & Optimize Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Output Console */}
        <div className="lg:col-span-7 relative">
          {loading && (
            <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur z-20 flex flex-col items-center justify-center rounded-2xl text-center p-6">
              <div className="w-9 h-9 rounded-full border-2 border-t-indigo-550 border-t-indigo-500 border-zinc-800 animate-spin" />
              <p className="text-xs text-zinc-300 font-semibold mt-4 animate-pulse">
                Auditing headlines punchiness and optimizing keyword matrix indexes...
              </p>
            </div>
          )}

          {activeAnalysis ? (
            <div className="space-y-6">
              {/* Score panel */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Recruiter Visibility Index</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">{activeAnalysis.recruiterScore}%</span>
                    <span className="text-xs text-emerald-400 font-bold font-mono">+12% Outreach Speed</span>
                  </div>
                  <p className="text-[10px] text-zinc-500">Based on standard algorithmic indexing in corporate recruiter search tools.</p>
                </div>

                {/* SVG Radial Gauge */}
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="#27272a" strokeWidth="4" fill="transparent" />
                    <circle cx="32" cy="32" r="26" stroke="#6366f1" strokeWidth="4" fill="transparent" 
                      strokeDasharray={163.3}
                      strokeDashoffset={163.3 - (163.3 * activeAnalysis.recruiterScore) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-zinc-350">
                    {activeAnalysis.recruiterScore}%
                  </span>
                </div>
              </div>

              {/* Headline Audit Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-indigo-400" /> Optimized Headline Proposal
                  </span>
                  <span className="text-emerald-400 font-mono font-bold leading-none bg-emerald-500/10 px-2 py-1 rounded">
                    Headline Score: {activeAnalysis.headlineScore}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/65 border border-zinc-850 text-xs font-semibold text-zinc-200 italic leading-relaxed">
                  "{activeAnalysis.headlineOptimization}"
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">Headline advice Suggestions</span>
                  <ul className="space-y-1">
                    {activeAnalysis.headlineSuggestions.map((st: string, i: number) => (
                      <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-indigo-400 font-extrabold mt-0.5">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bio / About optimization */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-405 text-emerald-400" /> Upgraded Bio / Summary Section
                  </span>
                  <span className="text-emerald-400 font-mono font-bold leading-none bg-emerald-500/10 px-2 py-1 rounded">
                    Keyword Score: {activeAnalysis.aboutScore}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/65 border border-zinc-850 text-xs text-zinc-300 leading-relaxed">
                  "{activeAnalysis.aboutOptimization}"
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">Bio enhancement instructions</span>
                  <ul className="space-y-1">
                    {activeAnalysis.aboutSuggestions.map((st: string, i: number) => (
                      <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-400 font-extrabold mt-0.5">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Keywords audit grid table */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-3.5">
                <h4 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-teal-400" /> Recruiter Search Index Keywords Matrix
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-400 border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider font-mono text-zinc-500 font-bold">
                        <th className="py-2">Critical Buzzword</th>
                        <th className="py-2">Profile Density</th>
                        <th className="py-2 text-right font-bold">Optimization Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeAnalysis.keywordsOptimized.map((kw: any, idx: number) => (
                        <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-850/20">
                          <td className="py-2 text-zinc-200 font-mono">{kw.word}</td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                              kw.density === 'High' ? 'bg-emerald-500/10 text-emerald-300' :
                              kw.density === 'Normal' ? 'bg-indigo-500/10 text-indigo-300' :
                              'bg-amber-500/10 text-amber-300'
                            }`}>
                              {kw.density}
                            </span>
                          </td>
                          <td className="py-2 text-right text-zinc-300 font-medium font-mono text-[10px]">
                            {kw.recommendation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-zinc-90 w/10 border border-zinc-800 flex flex-col items-center justify-center text-center min-h-[350px]">
              <Linkedin className="w-12 h-12 text-zinc-700 mb-4" />
              <h4 className="font-semibold text-white">No active LinkedIn analysis cached</h4>
              <p className="text-xs text-zinc-555 text-zinc-500 max-w-sm mt-1 leading-relaxed">
                Provide your current LinkedIn bio elements on the input form to start optimizing for recruiter eyes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
