import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Layers, 
  Cpu, 
  Terminal, 
  Tv, 
  Clock, 
  Briefcase 
} from 'lucide-react';

interface LandingPageProps {
  onStart: (isSignup: boolean) => void;
  onExploreDemo: () => void;
}

export default function LandingPage({ onStart, onExploreDemo }: LandingPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "CareerPilot AI is the single reason I converted my internship at Stripe. The ATS Scanner highlighted exact keywords my recruiter was looking for, and the Technical Mock Interview felt identical to the actual system design loops.",
      author: "Jessica Chen",
      role: "Incoming Software Engineer",
      company: "Stripe",
      avatarBg: "from-blue-600 to-indigo-600",
      rating: 5
    },
    {
      quote: "The personalized learning roadmaps are elite. It mapped out daily tasks to bridge my database architecture knowledge gaps, enabling me to interview with maximum confidence.",
      author: "Alexander Mercer",
      role: "Cloud DevOps Associate",
      company: "AWS",
      avatarBg: "from-amber-500 to-orange-600",
      rating: 5
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50" id="landing-page">
      {/* Premium Apple/Stripe Ambient Blur Glow Drops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation header bar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-900/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            CareerPilot <span className="text-xs text-indigo-400 font-extrabold px-1.5 py-0.5 rounded bg-indigo-505 bg-indigo-500/10 border border-indigo-500/10 uppercase tracking-widest ml-1">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing Plan</a>
          <button 
            type="button" 
            onClick={onExploreDemo}
            className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Terminal Sandbox
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => onStart(false)} 
            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white py-2 px-3 cursor-pointer font-mono"
          >
            Sign In
          </button>
          
          <button 
            type="button"
            onClick={() => onStart(true)} 
            className="text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all px-4 py-2.5 rounded-xl border border-indigo-400/30 flex items-center gap-1.5 cursor-pointer font-mono"
          >
            Start Free <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Header Area */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-90 w bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Venture Backed Professional SaaS V2</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-white max-w-4xl mx-auto">
            Land Your Dream Job <br /> Faster with AI
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 mt-6 leading-relaxed font-medium">
            Analyze resumes, identify skill gaps, practice interviews, and build a personalized roadmap with CareerPilot AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 pt-6">
            <button
              type="button"
              onClick={() => onStart(true)}
              className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest font-mono text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 px-8 py-4 rounded-xl border border-indigo-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
            >
              Get Started Free <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </button>
            
            <button
              type="button"
              onClick={onExploreDemo}
              className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest font-mono text-zinc-300 bg-zinc-900/60 hover:bg-zinc-900/95 border border-zinc-800 active:scale-95 px-8 py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 group"
            >
              Watch Demo <Play className="w-4 h-4 text-zinc-500 group-hover:text-white" />
            </button>
          </div>
        </motion.div>

        {/* Dashboard Preview Frame Mockup */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.8 }}
           className="relative mt-16 p-2 rounded-2xl bg-zinc-90 w/60 bg-zinc-905 bg-zinc-900/40 border border-zinc-800 shadow-2xl backdrop-blur max-w-4xl mx-auto overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-violet-500/5 opacity-40 pointer-events-none" />
          
          {/* Header Browser Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/80 rounded-t-xl border-b border-zinc-800/60 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="text-[10px] text-zinc-550 text-zinc-500 font-mono tracking-wide">careerpilot.ai/dashboard/score</div>
            <div className="w-10" />
          </div>

          {/* Interactive animated preview visual panel (Stripe Style) */}
          <div className="bg-zinc-950/70 p-6 text-left relative min-h-[280px] flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-805 border-zinc-800 space-y-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 font-mono">Career Readiness Gauge</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono animate-pulse">82%</span>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">EXCELLENT</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full w-[82%]" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#a855f7] font-mono">ATS Resume Analyzer</span>
                <p className="text-[11px] text-zinc-300 font-semibold truncate leading-none">charan_internship_resume.pdf</p>
                <div className="flex justify-between items-center text-[10px] pt-1.5">
                  <span className="text-zinc-500">ATS Keywords:</span>
                  <strong className="text-emerald-400 font-bold font-mono">78% Match</strong>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-teal-400 font-mono">Mock Interview Cockpit</span>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] text-zinc-300 font-medium">Listening to speech transcripts</span>
                </div>
                <p className="text-[10px] text-zinc-500 italic truncate">"With React 19 state transitions solve..."</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-zinc-900/40 border border-zinc-805 border-zinc-800 rounded-xl p-3 mt-6 text-xs gap-4">
              <span className="text-zinc-400 font-mono text-[10px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Double click preview frame to enter sandbox dashboard controls
              </span>
              <button 
                type="button" 
                onClick={onExploreDemo}
                className="px-3.5 py-1.5 rounded bg-white text-zinc-950 font-bold text-[10px] uppercase tracking-wider font-mono hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                Launch Sandbox Panel
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Recruiter Placement partners */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-6 border-y border-zinc-900/60 text-center uppercase tracking-widest font-mono text-[10px] text-zinc-500">
        <span>Empowering candidates from top student cohorts to validate matching criteria at</span>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 mt-5 opacity-40 grayscale select-none text-[13px] font-black font-sans">
          <span>Stripe</span>
          <span>Notion</span>
          <span>Linear</span>
          <span>Google</span>
          <span>OpenAI</span>
        </div>
      </section>

      {/* Features Cards Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Integrated Recruiters Intelligence
          </h2>
          <p className="text-zinc-400 mt-3 text-xs leading-relaxed">
            Pristine Apple-style product designs offering deep programmatic analytics modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur space-y-4">
            <div className="p-2.5 w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">Resume Scanner Pro</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Drag-and-drop resume PDFs directly to read core formatting, detect missing keywords, and assess recruiter perspective ratings.
            </p>
          </div>

          <div className="p-6.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur space-y-4">
            <div className="p-2.5 w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">Skill Intelligence</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Audit demand parameters against live skill matrices using animated hot grid heatmaps representing missing core engineering frameworks.
            </p>
          </div>

          <div className="p-6.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur space-y-4">
            <div className="p-2.5 w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/15 flex items-center justify-center text-teal-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">Simulator Loops</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Engage multi-modal Video, Voice, and Chat mock interview simulators with real-time semantic transcription assessments.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Pricing cards */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16" id="pricing">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-black tracking-tight text-white">SaaS Pricing Packages</h2>
          <p className="text-zinc-500 text-xs mt-2 font-medium">Transparent credits mapping with infinite sandbox playground capability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Box 1 */}
          <div className="p-6.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-zinc-400">Free Sandbox</span>
              <div className="text-3xl font-black text-white font-mono mt-2">$0</div>
              <p className="text-[11px] text-zinc-500 mt-1">Simulated learning pipelines</p>
              
              <ul className="space-y-2.5 mt-6 text-xs text-zinc-300">
                <li className="flex items-center gap-2">• Standard Resume scans</li>
                <li className="flex items-center gap-2">• Basic skill matrices</li>
                <li className="flex items-center gap-2">• 1 practice interview round</li>
              </ul>
            </div>
            <button type="button" onClick={() => onStart(true)} className="w-full mt-6 py-2.5 rounded-xl border border-zinc-800 text-xs font-bold uppercase tracking-wider font-mono text-zinc-300 hover:bg-zinc-800 transition cursor-pointer text-center">Start Free</button>
          </div>

          {/* Box 2 Premium */}
          <div className="p-6.5 rounded-2xl bg-zinc-910 bg-zinc-900/90 border border-indigo-500/40 backdrop-blur flex flex-col justify-between relative shadow-2xl shadow-indigo-500/5">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-indigo-600 text-white font-extrabold text-[8px] uppercase tracking-wider rounded-full font-mono">RECOMMENDED</span>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-indigo-400">Pro Advisor</span>
              <div className="text-3xl font-black text-white font-mono mt-2">$19<span className="text-xs text-zinc-500 font-normal">/mo</span></div>
              <p className="text-[11px] text-zinc-500 mt-1">Full premium recruiter tooling</p>
              
              <ul className="space-y-2.5 mt-6 text-xs text-zinc-200">
                <li className="flex items-center gap-2 text-indigo-300">• Live Gemini PDF parses</li>
                <li className="flex items-center gap-2">• Infinite Mock sessions</li>
                <li className="flex items-center gap-2">• Portfolio GitHub scouter</li>
                <li className="flex items-center gap-2">• LinkedIn Headline audits</li>
              </ul>
            </div>
            <button type="button" onClick={() => onStart(true)} className="w-full mt-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider font-mono hover:bg-indigo-505 hover:bg-indigo-500 transition cursor-pointer text-center">Upgrade to Pro</button>
          </div>

          {/* Box 3 */}
          <div className="p-6.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-violet-400">Team Pilot</span>
              <div className="text-3xl font-black text-white font-mono mt-2">$49<span className="text-xs text-zinc-500 font-normal">/mo</span></div>
              <p className="text-[11px] text-zinc-500 mt-1">Bulk parsing analytics logs</p>
              
              <ul className="space-y-2.5 mt-6 text-xs text-zinc-300">
                <li className="flex items-center gap-2">• Full Admin metrics metrics</li>
                <li className="flex items-center gap-2">• Dedicated S3 logs paths</li>
                <li className="flex items-center gap-2">• Google Workspace syncs</li>
              </ul>
            </div>
            <button type="button" onClick={() => onStart(true)} className="w-full mt-6 py-2.5 rounded-xl border border-zinc-800 text-xs font-bold uppercase tracking-wider font-mono text-zinc-350 hover:bg-zinc-805 hover:bg-zinc-800 transition cursor-pointer text-center">Select Enterprise</button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-6">
        <span className="font-bold flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-400" /> CareerPilot AI V2 — Cupertino, Stripe, Notion Designed
        </span>
        <div className="flex gap-6 font-semibold uppercase tracking-wider font-mono">
          <a href="#features" className="hover:text-white transition-colors">Documentation</a>
          <a href="#pricing" className="hover:text-white transition-colors">Privacy</a>
          <button type="button" onClick={onExploreDemo} className="text-indigo-400 hover:text-indigo-300 transition-colors pointer cursor-pointer">Terminal Sandbox</button>
        </div>
      </footer>
    </div>
  );
}
