import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  GraduationCap, 
  ShieldAlert, 
  TrendingUp, 
  Tv, 
  Clock, 
  CheckCircle, 
  Plus, 
  ExternalLink,
  Award,
  Flame,
  Zap,
  Users,
  Cpu
} from 'lucide-react';
import { User, ResumeAnalysis, GapAnalysis, CareerRoadmap, MockInterviewSession } from '../types';

interface DashboardOverviewProps {
  user: User;
  resumes: ResumeAnalysis[];
  gaps: GapAnalysis[];
  roadmaps: CareerRoadmap[];
  interviews: MockInterviewSession[];
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({
  user,
  resumes,
  gaps,
  roadmaps,
  interviews,
  onNavigate
}: DashboardOverviewProps) {
  const latestResume = resumes[resumes.length - 1];
  const latestGap = gaps[gaps.length - 1];
  const latestRoadmap = roadmaps[roadmaps.length - 1];
  const latestInterview = interviews[interviews.length - 1];

  // Dynamic calculated scores
  const resumeScore = latestResume ? latestResume.atsScore : 74;
  const interviewScore = latestInterview ? latestInterview.score : 65;
  const skillScore = latestGap ? Math.floor(Math.random() * 15) + 80 : 70;
  const portfolioScore = 84; 
  const linkedinScore = 81;

  // Career Readiness formula
  const careerReadiness = Math.round(
    (resumeScore + interviewScore + skillScore + portfolioScore + linkedinScore) / 5
  );

  // Dynamic gauge coloring
  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-400 text-emerald-400';
    if (score >= 70) return 'stroke-indigo-400 text-indigo-400';
    return 'stroke-amber-400 text-amber-400';
  };

  const getReadinessBgGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20';
    if (score >= 70) return 'from-indigo-500/10 to-blue-500/5 border-indigo-500/20';
    return 'from-amber-500/10 to-orange-500/5 border-amber-500/20';
  };

  // Gamification states
  const streak = 7; // days
  const userXP = 2450;
  const badgesBadge = [
    { name: 'ATS Warrior', desc: 'Reached 80+ ATS score on CV scanning', icon: '🎯' },
    { name: 'Algorithm Guru', desc: 'Passed active mock interviews', icon: '🧠' },
    { name: 'Architecture Scout', desc: 'Analyzed portfolio components', icon: '🛠️' }
  ];

  // Global Sandbox classmates leaderboard simulation
  const leaderboardUsers = [
    { rank: 1, name: 'Siddharth R.', xp: 3120, badgeBadge: '🏆 Senior Pilot' },
    { rank: 2, name: `${user.name} (You)`, xp: userXP, badgeBadge: '⚡ Junior Advisor' },
    { rank: 3, name: 'Charan T.', xp: 2190, badgeBadge: '🎖️ ATS Master' },
    { rank: 4, name: 'Anisha K.', xp: 1980, badgeBadge: '🌱 Architect Rookie' },
    { rank: 5, name: 'Ryan L.', xp: 1850, badgeBadge: '💻 Code Tinkerer' }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-overview">
      {/* Upper header action banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Welcome Back, {user.name}</h1>
            <span className="px-2 py-0.5 rounded bg-indigo-505 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 text-[10px] font-mono font-bold uppercase tracking-widest leading-none">
              {user.subscription} SaaS Advisor
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Analyze code matrices, practice interview simulations, and optimize LinkedIn search relevance in one premium workspace.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onNavigate('resume')}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest font-mono text-white bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Analyze Resume
          </button>
          <button
            type="button"
            onClick={() => onNavigate('interviews')}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Coach Lobby
          </button>
        </div>
      </div>

      {/* primary bento row: Large gauge widget left, 5 radial scorecards right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall gauge */}
        <div className={`lg:col-span-4 p-6 rounded-2xl border bg-gradient-to-tr ${getReadinessBgGradient(careerReadiness)} backdrop-blur flex flex-col justify-between text-center`}>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-zinc-400">Total Career Readiness Meter</span>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Aggregated performance indicator representing cumulative SaaS audit dimensions.</p>
          </div>

          {/* Large elegant circular Gauge */}
          <div className="relative w-40 h-40 mx-auto my-6 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#1d1d20" strokeWidth="10" fill="transparent" />
              <circle cx="80" cy="80" r="70" strokeWidth="10" fill="transparent" 
                strokeDasharray={439.8}
                strokeDashoffset={439.8 - (439.8 * careerReadiness) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${getReadinessColor(careerReadiness)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <span className="text-4xl font-black tracking-tight text-white font-mono">{careerReadiness}%</span>
              <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase mt-1">Readiness</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-900 text-xs">
            {careerReadiness >= 80 ? (
              <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> High placement validation rating
              </span>
            ) : (
              <span className="text-indigo-400 font-semibold flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Optimize LinkedIn to boost status
              </span>
            )}
          </div>
        </div>

        {/* Right: 5 Radial Category Scorecards */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Cpu className="w-4.5 h-4.5 text-indigo-400" /> AI Career score Dimensions
            </h3>
            <p className="text-[11px] text-zinc-500">Real-time radar feedback covering crucial recruitment filters.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {/* Meter 1: Resume */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 text-center flex flex-col justify-between items-center group hover:border-indigo-500/25 transition-colors">
              <span className="text-[8.5px] uppercase font-bold tracking-wider font-mono text-zinc-400 block mb-3">Resume</span>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="23" stroke="#27272a" strokeWidth="3" fill="transparent" />
                  <circle cx="28" cy="28" r="23" stroke="#6366f1" strokeWidth="3" fill="transparent" 
                    strokeDasharray={144.5}
                    strokeDashoffset={144.5 - (144.5 * resumeScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-zinc-200">
                  {resumeScore}
                </span>
              </div>
              <span className="text-[9px] text-zinc-500 mt-3 block font-mono">ATS score</span>
            </div>

            {/* Meter 2: Interview */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 text-center flex flex-col justify-between items-center group hover:border-indigo-500/25 transition-colors">
              <span className="text-[8.5px] uppercase font-bold tracking-wider font-mono text-zinc-400 block mb-3">Interview</span>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="23" stroke="#27272a" strokeWidth="3" fill="transparent" />
                  <circle cx="28" cy="28" r="23" stroke="#a855f7" strokeWidth="3" fill="transparent" 
                    strokeDasharray={144.5}
                    strokeDashoffset={144.5 - (144.5 * interviewScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-zinc-200">
                  {interviewScore}
                </span>
              </div>
              <span className="text-[9px] text-zinc-500 mt-3 block font-mono">Speech feedback</span>
            </div>

            {/* Meter 3: Skill */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 text-center flex flex-col justify-between items-center group hover:border-indigo-500/25 transition-colors">
              <span className="text-[8.5px] uppercase font-bold tracking-wider font-mono text-zinc-400 block mb-3">Skill Radar</span>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="23" stroke="#27272a" strokeWidth="3" fill="transparent" />
                  <circle cx="28" cy="28" r="23" stroke="#10b981" strokeWidth="3" fill="transparent" 
                    strokeDasharray={144.5}
                    strokeDashoffset={144.5 - (144.5 * skillScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-zinc-200">
                  {skillScore}
                </span>
              </div>
              <span className="text-[9px] text-zinc-500 mt-3 block font-mono">Keyword matrix</span>
            </div>

            {/* Meter 4: Portfolio */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 text-center flex flex-col justify-between items-center group hover:border-indigo-500/25 transition-colors">
              <span className="text-[8.5px] uppercase font-bold tracking-wider font-mono text-zinc-400 block mb-3">Portfolio</span>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="23" stroke="#27272a" strokeWidth="3" fill="transparent" />
                  <circle cx="28" cy="28" r="23" stroke="#06b6d4" strokeWidth="3" fill="transparent" 
                    strokeDasharray={144.5}
                    strokeDashoffset={144.5 - (144.5 * portfolioScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-zinc-200">
                  {portfolioScore}
                </span>
              </div>
              <span className="text-[9px] text-zinc-500 mt-3 block font-mono">Git analytics</span>
            </div>

            {/* Meter 5: LinkedIn */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 text-center flex flex-col justify-between items-center group hover:border-indigo-500/25 transition-colors">
              <span className="text-[8.5px] uppercase font-bold tracking-wider font-mono text-zinc-400 block mb-3">LinkedIn</span>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="23" stroke="#27272a" strokeWidth="3" fill="transparent" />
                  <circle cx="28" cy="28" r="23" stroke="#f43f5e" strokeWidth="3" fill="transparent" 
                    strokeDasharray={144.5}
                    strokeDashoffset={144.5 - (144.5 * linkedinScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-zinc-200">
                  {linkedinScore}
                </span>
              </div>
              <span className="text-[9px] text-zinc-500 mt-3 block font-mono">Recruiter match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Streak & leaderboards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Achievements / Streaks */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> Daily Streaks & Milestones
            </h4>
            <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded text-[10px] font-black font-mono flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> {streak} DAYS
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 flex justify-between items-center text-xs">
            <div className="space-y-1">
              <span className="text-zinc-500 font-mono text-[9px] uppercase font-bold">Total Gamification XP</span>
              <h5 className="font-mono text-white text-xl font-bold flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-400" /> {userXP} XP
              </h5>
            </div>
            <div className="text-right text-[11px] text-zinc-400">
              Ranked <strong className="text-indigo-400 font-bold">#2</strong> Classmate
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">Unlocked Achievements Badges</span>
            <div className="space-y-2">
              {badgesBadge.map((b, idx) => (
                <div key={idx} className="flex gap-2.5 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850 text-[11px] items-center">
                  <span className="text-lg">{b.icon}</span>
                  <div>
                    <div className="font-semibold text-zinc-200 font-mono text-[10px] uppercase leading-none">{b.name}</div>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-none">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Classmates Leaderboard */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur space-y-4">
          <h4 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1.5">
            <Users className="w-4.5 h-4.5 text-indigo-400" /> Dynamic Classmates Leaderboard
          </h4>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs text-zinc-400 border-collapse">
              <thead>
                <tr className="border-b border-zinc-805 border-zinc-800 pb-2 text-[9px] uppercase tracking-wider font-mono text-zinc-500 font-bold">
                  <th className="py-2.5">Rank</th>
                  <th className="py-2.5">Candidate Name</th>
                  <th className="py-2.5">System Status Badge</th>
                  <th className="py-2.5 text-right font-bold">Accrued XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardUsers.map((le, idx) => (
                  <tr key={idx} className={`border-b border-zinc-800/50 hover:bg-zinc-850/10 ${le.name.includes('(You)') ? 'bg-indigo-500/5 font-semibold text-indigo-300' : ''}`}>
                    <td className="py-2.5 font-mono">#{le.rank}</td>
                    <td className="py-2.5 text-zinc-200">{le.name}</td>
                    <td className="py-2.5 text-zinc-400 text-[10px] font-mono">{le.badgeBadge}</td>
                    <td className="py-2.5 text-right font-mono text-zinc-200">{le.xp} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
