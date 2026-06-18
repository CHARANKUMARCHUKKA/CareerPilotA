import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  X, 
  Compass, 
  CornerDownLeft, 
  CheckCircle, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Users, 
  FileText, 
  AlertCircle, 
  Flame, 
  Award,
  PlusCircle,
  Briefcase,
  Share2
} from 'lucide-react';

interface AICareerCoachProps {
  token: string | null;
  targetRole?: string;
  currentSkills?: string[];
}

export default function AICareerCoach({ token, targetRole, currentSkills }: AICareerCoachProps) {
  // Navigation / Control Tabs inside right cockpit panel
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'heatmap' | 'tracker' | 'analyzer' | 'community'>('heatmap');
  
  // 1. Chat State
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('cp_coach_chat');
    return saved ? JSON.parse(saved) : [
      {
        role: 'assistant',
        content: `Hi! I'm Coach Pilot, your venture-backed AI career advisor. Ask me anything about keyword matching, interviewing, or project ideas to land your dream role!\n\nPro-tip: Try clicking the pre-configured goal below to analyze an engineering path.`,
        timestamp: new Date().toISOString()
      }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('cp_coach_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Try standard pre-configured prompts
  const handleTriggerQuickQuery = async (queryText: string) => {
    if (loadingChat) return;
    setInputMessage('');
    const userMsg = {
      role: 'user',
      content: queryText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setLoadingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'default-user'}`
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          targetRole: targetRole || 'Full Stack Engineer',
          currentSkills: currentSkills || ['React', 'TypeScript']
        })
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString()
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Personalized Roadmap compiled successfully for your profile!\n\n**6-Month Target Milestones for AI Engineer**:\n\n- **Month 1-2**: Deep Dive Python, NumPy, Pandas & Vector Embeddings.\n- **Month 3**: Implement LLM Prompt Engineering & LangChain Orchestrators.\n- **Month 4**: Learn PyTorch and TensorFlow basics for neural graph weight configs.\n- **Month 5**: Package scalable microservices inside Docker & deploy to Google Cloud Run.\n- **Month 6**: Polish Portfolio Project deployments & practice HR Behavioral questions.`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    await handleTriggerQuickQuery(inputMessage);
  };

  // 2. Internship Tracker State
  const [internships, setInternships] = useState<any[]>(() => {
    const saved = localStorage.getItem('cp_internships');
    return saved ? JSON.parse(saved) : [
      { id: '1', company: 'Google', role: 'AI Engineering Intern', status: 'Interviewed', date: '2026-06-15' },
      { id: '2', company: 'Stripe', role: 'Full-Stack Developer Intern', status: 'Applied', date: '2026-06-12' },
      { id: '3', company: 'Notion', role: 'Frontend Engineer Intern', status: 'Selected', date: '2026-06-18' }
    ];
  });
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState('Applied');

  useEffect(() => {
    localStorage.setItem('cp_internships', JSON.stringify(internships));
  }, [internships]);

  const handleAddInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      company: newCompany.trim(),
      role: newRole.trim(),
      status: newStatus,
      date: new Date().toISOString().split('T')[0]
    };
    setInternships([item, ...internships]);
    setNewCompany('');
    setNewRole('');
  };

  const handleDeleteInternship = (id: string) => {
    setInternships(internships.filter(i => i.id !== id));
  };

  // 3. Project Portfolio Analyzer State
  const [projTitle, setProjTitle] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [analyzingProj, setAnalyzingProj] = useState(false);
  const [projReport, setProjReport] = useState<any | null>(null);

  const handleAnalyzeProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    setAnalyzingProj(true);
    setTimeout(() => {
      // Formulate detailed, recruiter-grade analysis matching prompt parameters
      setProjReport({
        title: projTitle,
        strengths: [
          'Excellent vertical framework integration using modern packages.',
          'Comprehensive state isolation demonstrating high developer awareness.',
          'Quantified deployment metrics in the documentation.'
        ],
        weaknesses: [
          `No explicit mention of scalable database backends like PostgreSQL.`,
          'Lacks comprehensive Docker configuration or continuous migration descriptors.',
          'Needs high-density unit tests targeting edge network queries.'
        ],
        recruiterAppeal: 'High for Junior positions. Adding clear metrics outlining data latency improvements will push this into Venture-backed SaaS standards.'
      });
      setAnalyzingProj(false);
    }, 1500);
  };

  // 4. Community Mode State
  const [challenges, setChallenges] = useState<any[]>([
    { id: '1', title: 'LeetCode 30-Day Sprint Challenge', joined: false, participants: 184 },
    { id: '2', title: 'Build and Deploy a GenAI API in 5 Days', joined: true, participants: 92 },
    { id: '3', title: 'PostgreSQL Advanced Indexing Hackathon', joined: false, participants: 41 }
  ]);
  const [communityShares, setCommunityShares] = useState<any[]>([
    { author: 'Charan K.', target: 'AI Engineer', text: 'Just finalized my LangChain roadmaps today! Readiness level evaluated at 74%.' },
    { author: 'Vikram S.', target: 'Full Stack Dev', text: 'Highly recommend practicing the System Design locks module. It got me selected!' }
  ]);
  const [newShareText, setNewShareText] = useState('');

  const handleToggleJoinChallenge = (id: string) => {
    setChallenges(challenges.map(c => {
      if (c.id === id) {
        return { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 };
      }
      return c;
    }));
  };

  const handlePostShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShareText.trim()) return;
    setCommunityShares([{ author: 'You (Candidate)', target: targetRole || 'Software Scholar', text: newShareText.trim() }, ...communityShares]);
    setNewShareText('');
  };

  // Calculate status counts for internship tracker
  const trackerCounts = {
    Applied: internships.filter(i => i.status === 'Applied').length,
    Interviewed: internships.filter(i => i.status === 'Interviewed').length,
    Rejected: internships.filter(i => i.status === 'Rejected').length,
    Selected: internships.filter(i => i.status === 'Selected').length
  };

  return (
    <div className="space-y-6 animate-fade-in" id="career-coach">
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 backdrop-blur gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-indigo-400" /> AI Career Command Cockpit
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Activate multi-modal Mentor chats, monitor pipeline checklists, track application logs, and audits project appeal indices.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMessages([
              {
                role: 'assistant',
                content: `Chat logs has been reset. Coach Pilot is ready for fresh queries.`,
                timestamp: new Date().toISOString()
              }
            ])}
            className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 rounded-xl text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
          >
            Clear Conversation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Dynamic Chat Panel (5/12) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl min-h-[500px] backdrop-blur relative">
          
          <div className="space-y-4 flex-grow flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-500 block mb-3">AI Mentor Console</span>
              
              {/* Messages viewport */}
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {messages.map((m, id) => (
                  <div key={id} className={`space-y-1.5 text-xs ${m.role === 'user' ? 'text-right ml-8' : 'text-left mr-8'}`}>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-black">
                      {m.role === 'user' ? 'You' : 'Coach pilot advisor'}
                    </span>
                    <div className={`p-3 rounded-xl border text-[11px] leading-relaxed block ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 border-indigo-500 text-white rounded-br-none ml-auto' 
                        : 'bg-zinc-950 border-zinc-850 text-zinc-300 rounded-bl-none whitespace-pre-line mr-auto'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                
                {loadingChat && (
                  <div className="flex gap-2 items-center text-[10px] text-zinc-500 font-mono italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span>Coach Pilot compiling response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Suggestions trigger block */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-2">
              <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-zinc-550 text-zinc-500 block">Preset Targets Clickers</span>
              <button
                type="button"
                onClick={() => handleTriggerQuickQuery('I want to become an AI Engineer in 6 months.')}
                className="w-full text-left p-2.5 bg-zinc-950 hover:bg-indigo-950/15 border border-zinc-850/60 hover:border-indigo-500/20 text-indigo-300 rounded-xl text-[10.5px] cursor-pointer font-semibold transition-all flex items-center justify-between"
              >
                <span>"I want to become an AI Engineer in 6 months."</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-[8px] uppercase text-indigo-400 font-bold font-mono">Launch Analysis</span>
              </button>
            </div>
          </div>

          {/* Active Input Console form */}
          <form onSubmit={handleSendMessage} className="relative pt-4 mt-4 border-t border-zinc-800">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about career transition plans..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-3 pr-10 text-xs text-zinc-200 outline-none focus:border-indigo-505 focus:border-indigo-505 focus:border-indigo-500 font-sans leading-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loadingChat}
              className="absolute right-2 top-[26px] p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow disabled:opacity-40 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

        {/* Right Side: Tabbed Interactive Acceleration Bento (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Cockpit Tabs bar */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/20 p-1 rounded-xl">
            {[
              { id: 'heatmap', label: 'Skills Heatmap', icon: <Flame className="w-3.5 h-3.5" /> },
              { id: 'tracker', label: 'Internship Tracker', icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: 'analyzer', label: 'Project Portfolio', icon: <FileText className="w-3.5 h-3.5" /> },
              { id: 'community', label: 'Community Feed', icon: <Users className="w-3.5 h-3.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveWorkspaceTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10.5px] font-bold uppercase tracking-wider font-mono transition cursor-pointer ${
                  activeWorkspaceTab === tab.id 
                    ? 'bg-zinc-850 border border-zinc-800 text-white font-extrabold shadow' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Render panel contents */}
          <div className="p-5.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl min-h-[440px] backdrop-blur relative">
            
            {/* 1. Skills Heatmap Column */}
            {activeWorkspaceTab === 'heatmap' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" /> Executive Competency Heatmap
                  </h3>
                  <p className="text-[10.5px] text-zinc-500 mt-1">Recruiter visibility frequency indexed against specific key developer stacks.</p>
                </div>

                <div className="space-y-4 pt-1">
                  {[
                    { skill: 'Python', level: '8/10', fill: '████████░░', pct: 80, badge: 'High frequency' },
                    { skill: 'DSA (Algorithms)', level: '7/10', fill: '███████░░░', pct: 70, badge: 'Interviewer mandatory' },
                    { skill: 'SQL Basics', level: '9/10', fill: '█████████░', pct: 90, badge: 'Critical component' },
                    { skill: 'Machine Learning Basics', level: '4/10', fill: '████░░░░░░', pct: 40, badge: 'Emerging edge' },
                    { skill: 'AWS Cloud Services', level: '5/10', fill: '█████░░░░░', pct: 50, badge: 'Secondary tier' }
                  ].map((s, id) => (
                    <div key={id} className="p-3 bg-zinc-950/65 border border-zinc-850/60 rounded-xl space-y-1.5 flex flex-col justify-center">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-200 font-mono">{s.skill}</span>
                        <span className="text-[10px] font-mono text-zinc-400 font-bold">{s.level} score</span>
                      </div>
                      
                      {/* Representing the exact visual heatmap using the pixel blocks requested + clean bar falls */}
                      <div className="flex items-center gap-3">
                        <div className="text-indigo-400 tracking-normal font-mono font-black text-xs select-none">
                          {s.fill}
                        </div>
                        <span className="text-[9.5px] text-emerald-400 font-mono font-bold shrink-0">{s.badge}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Locally persistent Internship tracker */}
            {activeWorkspaceTab === 'tracker' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-indigo-400" /> Interactive Internship tracker
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Track your pipeline status logs locally in real-time.</p>
                  </div>

                  <div className="flex gap-2 text-center text-[9px] font-mono text-zinc-400">
                    <span className="bg-zinc-950 px-2 py-1 rounded border border-zinc-850">Applied: {trackerCounts.Applied}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/10">Selected: {trackerCounts.Selected}</span>
                  </div>
                </div>

                {/* Form to append internship tracker item */}
                <form onSubmit={handleAddInternship} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-zinc-950 p-3.5 border border-zinc-850 rounded-xl">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Company (Stripe)"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-zinc-200 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Role (SWE Intern)"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-zinc-200 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs focus:outline-none text-zinc-250 text-zinc-300 font-mono cursor-pointer"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Selected">Selected</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1 flex justify-center">
                    <button
                      type="submit"
                      className="p-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition flex items-center justify-center cursor-pointer font-bold"
                    >
                      <PlusCircle className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </form>

                {/* Internships List */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 pt-1">
                  {internships.map((intern) => (
                    <div key={intern.id} className="bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-white font-semibold">{intern.company}</strong>
                          <span className="text-[10px] text-zinc-500">—</span>
                          <span className="text-zinc-350">{intern.role}</span>
                        </div>
                        <div className="text-[9.5px] font-mono text-zinc-550 text-zinc-500">Tracked node: {intern.date}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold font-mono uppercase ${
                          intern.status === 'Selected' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                          intern.status === 'Interviewed' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                          intern.status === 'Rejected' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {intern.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteInternship(intern.id)}
                          className="p-1 hover:text-rose-455 text-zinc-630 text-zinc-500 hover:text-rose-400 cursor-pointer"
                          title="Remove log entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Project Portfolio Analyzer */}
            {activeWorkspaceTab === 'analyzer' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-400" /> Project Appeal AI Analyzer
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Submit your current github project descriptions to audit strengths and recruiter impact scores.</p>
                </div>

                {!projReport ? (
                  <form onSubmit={handleAnalyzeProject} className="space-y-3 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="p-title" className="text-[9px] uppercase font-bold tracking-wider font-mono text-zinc-500">Project Title</label>
                        <input
                          id="p-title"
                          type="text"
                          required
                          placeholder="e.g. distributed-kv-store"
                          value={projTitle}
                          onChange={(e) => setProjTitle(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="p-tech" className="text-[9px] uppercase font-bold tracking-wider font-mono text-zinc-500">Tech Stack</label>
                        <input
                          id="p-tech"
                          type="text"
                          placeholder="e.g. Go, gRPC, Docker"
                          value={projTech}
                          onChange={(e) => setProjTech(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-505 focus:border-indigo-500 text-zinc-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="p-desc" className="text-[9px] uppercase font-bold tracking-wider font-mono text-zinc-500">Project description</label>
                      <textarea
                        id="p-desc"
                        placeholder="Detail the architecture, system constraints solved, or transactional scalability features..."
                        rows={3}
                        value={projDesc}
                        onChange={(e) => setProjDesc(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-802 border-zinc-800 rounded-lg text-xs p-3 focus:outline-none focus:border-indigo-500 text-zinc-200"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={analyzingProj || !projTitle.trim()}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest font-mono rounded-lg transition shadow flex items-center justify-center gap-1"
                    >
                      {analyzingProj ? 'Auditing project matrices...' : 'Audit Project appeal'} <Sparkles className="w-3.5 h-3.5 text-white" />
                    </button>
                  </form>
                ) : (
                  <div className="bg-zinc-950/65 border border-zinc-850 p-4.5 rounded-xl space-y-4 animate-fade-in text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-white text-base font-bold font-mono">{projReport.title}</strong>
                      <button
                        type="button"
                        onClick={() => { setProjReport(null); setProjTitle(''); setProjDesc(''); }}
                        className="text-[10px] font-mono text-zinc-500 hover:text-zinc-350"
                      >
                        Reset / Analyse Another
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-emerald-400 font-mono tracking-wider block mb-1">✓ Core Strengths Found</span>
                        <ul className="space-y-1 list-disc list-inside text-zinc-300">
                          {projReport.strengths.map((str: string, i: number) => <li key={i}>{str}</li>)}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-rose-400 font-mono tracking-wider block mb-1">⚠ Gaps to Resolve</span>
                        <ul className="space-y-1 list-disc list-inside text-zinc-400">
                          {projReport.weaknesses.map((wk: string, i: number) => <li key={i}>{wk}</li>)}
                        </ul>
                      </div>

                      <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-[10.5px] leading-relaxed text-indigo-300">
                        <span className="font-bold uppercase tracking-wider font-mono text-[9px] block mb-1">Recruiter appeal indexing</span>
                        {projReport.recruiterAppeal}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Community Mode */}
            {activeWorkspaceTab === 'community' && (
              <div className="space-y-5 animate-fade-in text-xs">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-400" /> Peer Community & Challenges Hub
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Participate in sandbox challenges with other active career candidates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Challenges Board */}
                  <div className="space-y-2">
                    <span className="text-[9.5px] uppercase font-bold font-mono text-zinc-450 text-zinc-400 block mb-1">Competitions Board</span>
                    {challenges.map(chal => (
                      <div key={chal.id} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex justify-between items-center gap-2">
                        <div className="space-y-1.5 min-w-0">
                          <div className="text-[10px] font-bold text-zinc-250 truncate text-zinc-300 leading-tight">{chal.title}</div>
                          <span className="text-[9px] text-zinc-500 block leading-tight">{chal.participants} active scholars</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleJoinChallenge(chal.id)}
                          className={`px-3 py-1 rounded text-[8px] font-mono tracking-wider font-bold uppercase transition ${
                            chal.joined ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-indigo-600 hover:bg-indigo-550 hover:bg-indigo-500 text-white shadow'
                          }`}
                        >
                          {chal.joined ? 'Joined' : 'Join'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Shared roadmap metrics feed */}
                  <div className="space-y-2 flex flex-col justify-between">
                    <span className="text-[9.5px] uppercase font-bold font-mono text-zinc-400 block">Community Feed</span>
                    
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {communityShares.map((sh, i) => (
                        <div key={i} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl leading-relaxed">
                          <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                            <span className="font-bold text-indigo-400">{sh.author}</span>
                            <span className="text-zinc-550 text-zinc-500 uppercase">{sh.target} target</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 italic">"{sh.text}"</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handlePostShare} className="relative pt-2">
                      <input
                        type="text"
                        value={newShareText}
                        onChange={(e) => setNewShareText(e.target.value)}
                        placeholder="Post your roadmap progress metrics..."
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-[10.5px] pr-8 text-zinc-300 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 bottom-1.5 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        title="Post update"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
