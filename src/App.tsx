/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  FileText, 
  GraduationCap, 
  HelpCircle, 
  Tv, 
  Clock, 
  Menu, 
  X,
  CreditCard,
  User as UserIcon,
  Briefcase,
  AlertTriangle,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Settings as SettingsIcon,
  Activity,
  Github,
  Linkedin
} from 'lucide-react';

import { User, ResumeAnalysis, GapAnalysis, CareerRoadmap, MockInterviewSession } from './types';
import LandingPage from './components/LandingPage';
import DashboardOverview from './components/DashboardOverview';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import SkillGapAnalyzer from './components/SkillGapAnalyzer';
import RoadmapGenerator from './components/RoadmapGenerator';
import InterviewCoach from './components/InterviewCoach';
import ProjectRecommender from './components/ProjectRecommender';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';
import GitHubAnalyzer from './components/GitHubAnalyzer';
import LinkedInOptimizer from './components/LinkedInOptimizer';
import AICareerCoach from './components/AICareerCoach';

export default function App() {
  // Session Authentication state
  const [token, setToken] = useState<string | null>(localStorage.getItem('cp_token'));
  const [user, setUser] = useState<User | null>(null);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modals for Authentication
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; isSignup: boolean }>({ isOpen: false, isSignup: false });
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Domain states
  const [resumes, setResumes] = useState<ResumeAnalysis[]>([]);
  const [gaps, setGaps] = useState<GapAnalysis[]>([]);
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [interviews, setInterviews] = useState<MockInterviewSession[]>([]);

  // Skill gap targets memory to prefill roadmap generator
  const [roadmapPrefillRole, setRoadmapPrefillRole] = useState('');
  const [roadmapPrefillSkills, setRoadmapPrefillSkills] = useState<string[]>([]);

  // Recover active session user
  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Recover downstream portfolio logs
        fetchHistory(authToken);
      } else {
        // Clear stale session
        handleLogout();
      }
    } catch (err) {
      console.error('Session retrieval failed', err);
    }
  };

  const fetchHistory = async (authToken: string) => {
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      
      const [resumesRes, gapsRes, roadmapsRes, interviewsRes] = await Promise.all([
        fetch('/api/resume/history', { headers }),
        fetch('/api/skills/history', { headers }),
        fetch('/api/roadmaps/history', { headers }),
        fetch('/api/interviews/history', { headers })
      ]);

      if (resumesRes.ok) setResumes(await resumesRes.json());
      if (gapsRes.ok) setGaps(await gapsRes.json());
      if (roadmapsRes.ok) setRoadmaps(await roadmapsRes.json());
      if (interviewsRes.ok) setInterviews(await interviewsRes.json());
    } catch (err) {
      console.error('History recovery failure', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('cp_token');
    setToken(null);
    setUser(null);
    setResumes([]);
    setGaps([]);
    setRoadmaps([]);
    setInterviews([]);
    setActiveTab('dashboard');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim()) {
      setAuthError('Email credentials are required.');
      return;
    }

    const endpoint = authModal.isSignup ? '/api/auth/signup' : '/api/auth/login';
    const payload = authModal.isSignup 
      ? { email: authEmail, name: authName || 'Candidate', password: authPassword }
      : { email: authEmail, password: authPassword };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Identity validation failed.');
      }

      const data = await response.json();
      localStorage.setItem('cp_token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      // Close Modal and clear inputs
      setAuthModal({ isOpen: false, isSignup: false });
      setAuthEmail('');
      setAuthName('');
      setAuthPassword('');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  // Skip sign in / Launch demo
  const handleLaunchDemo = () => {
    localStorage.setItem('cp_token', 'default-user');
    setToken('default-user');
  };

  const handleTriggerRoadmapPrefill = (role: string, skills: string[]) => {
    setRoadmapPrefillRole(role);
    setRoadmapPrefillSkills(skills);
    setActiveTab('roadmaps');
  };

  // Nav side links matching mock requirements
  const navigationLinks = [
    { id: 'dashboard', label: 'Career Dashboard', icon: <Compass className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Career Mentor', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'resume', label: 'ATS Resume Analysis', icon: <FileText className="w-4 h-4" /> },
    { id: 'gaps', label: 'Skill Gap Analysis', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'roadmaps', label: 'Learning Roadmaps', icon: <Clock className="w-4 h-4" /> },
    { id: 'interviews', label: 'Mock Interviews', icon: <Tv className="w-4 h-4" /> },
    { id: 'projects', label: 'Portfolio Projects', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'github', label: 'GitHub Portfolio Scan', icon: <Github className="w-4 h-4" /> },
    { id: 'linkedin', label: 'LinkedIn Profile Expert', icon: <Linkedin className="w-4 h-4" /> },
    { id: 'admin', label: 'Platform Controls', icon: <ShieldAlert className="w-4 h-4" />, adminOnly: true },
    { id: 'settings', label: 'Account Configuration', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col font-sans" id="app">
      
      {/* 1. Unauthenticated landing view */}
      {!token ? (
        <LandingPage 
          onStart={(isSignup) => setAuthModal({ isOpen: true, isSignup })}
          onExploreDemo={handleLaunchDemo}
        />
      ) : (
        /* 2. Authenticated Dashboard workspace Layout */
        <div className="flex flex-1 h-screen overflow-hidden bg-zinc-950 relative">
          {/* Background Decoration Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

          {/* Desktop navigation Sidebar */}
          <aside className="hidden lg:flex flex-col w-[260px] bg-zinc-900/60 border-r border-zinc-800/80 p-5.5 flex-shrink-0 justify-between z-10 backdrop-blur-md">
            <div className="space-y-7.5">
              
              {/* Brand Logo */}
              <div className="flex items-center gap-2.5 px-1.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Compass className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-base font-extrabold text-transparent bg-gradient-to-r from-white to-zinc-400 bg-clip-text">
                  CareerPilot
                </span>
              </div>

              {/* Links list */}
              <nav className="space-y-1">
                {navigationLinks.map((link) => {
                  const hide = link.adminOnly && user?.role !== 'admin' && user?.email !== 'charan21003@gmail.com';
                  if (hide) return null;
                  
                  return (
                    <button
                      id={`nav-${link.id}`}
                      key={link.id}
                      type="button"
                      onClick={() => setActiveTab(link.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        activeTab === link.id 
                          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/15 shadow-inner' 
                          : 'text-zinc-405 hover:text-zinc-100 hover:bg-zinc-800/40'
                      }`}
                    >
                      {link.icon} {link.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Account details card */}
            {user && (
              <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5 px-1.5">
                  <div className="w-8.5 h-8.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="text-xs truncate max-w-[140px]">
                    <div className="font-semibold text-zinc-200 leading-none">{user.name}</div>
                    <span className="text-[10px] text-zinc-500 leading-none">{user.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 text-zinc-300"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-550 text-rose-500" /> Sign Out
                </button>
              </div>
            )}
          </aside>

          {/* Mobile Shell Drawer wrapper page */}
          <div className="flex flex-col flex-1 min-w-0 bg-zinc-950 overflow-hidden z-10">
            
            {/* Mobile Header indicator */}
            <header className="lg:hidden h-14 border-b border-zinc-800 bg-zinc-950/95 text-zinc-200 flex items-center justify-between px-4 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Compass className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-extrabold text-white text-sm">CareerPilot AI</span>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </header>

            {/* Mobile Sidebar overlay */}
            {sidebarOpen && (
              <div className="lg:hidden fixed inset-0 top-14 bg-zinc-950/95 backdrop-blur z-20 overflow-y-auto p-4 flex flex-col justify-between">
                <nav className="space-y-1">
                  {navigationLinks.map((link) => {
                    const hide = link.adminOnly && user?.role !== 'admin' && user?.email !== 'charan21003@gmail.com';
                    if (hide) return null;
                    
                    return (
                      <button
                        key={link.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(link.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer ${
                          activeTab === link.id 
                            ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/15'
                            : 'text-zinc-405 hover:text-zinc-200'
                        }`}
                      >
                        {link.icon} {link.label}
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setSidebarOpen(false);
                    }}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Internal Main Tab routing body */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7.5 bg-zinc-950 relative">
              {user && activeTab === 'dashboard' && (
                <DashboardOverview
                  user={user}
                  resumes={resumes}
                  gaps={gaps}
                  roadmaps={roadmaps}
                  interviews={interviews}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'resume' && (
                <ResumeAnalyzer
                  token={token}
                  resumes={resumes}
                  onAnalysisSuccess={(newR) => setResumes([...resumes, newR])}
                />
              )}

              {activeTab === 'gaps' && (
                <SkillGapAnalyzer
                  token={token}
                  resumes={resumes}
                  gaps={gaps}
                  onAnalysisSuccess={(newG) => setGaps([...gaps, newG])}
                  onGenerateRoadmap={handleTriggerRoadmapPrefill}
                />
              )}

              {activeTab === 'roadmaps' && (
                <RoadmapGenerator
                  token={token}
                  gapsRole={roadmapPrefillRole}
                  gapsSkills={roadmapPrefillSkills}
                  roadmaps={roadmaps}
                  onRoadmapGenerated={(newR) => {
                    setRoadmaps([...roadmaps, newR]);
                    setRoadmapPrefillRole('');
                    setRoadmapPrefillSkills([]);
                  }}
                  onUpdateRoadmap={(roadmapId, updatedMonths) => {
                    const idx = roadmaps.findIndex(r => r.id === roadmapId);
                    if (idx !== -1) {
                      const copy = [...roadmaps];
                      copy[idx].months = updatedMonths;
                      setRoadmaps(copy);
                    }
                  }}
                />
              )}

              {activeTab === 'coach' && (
                <AICareerCoach
                  token={token}
                  targetRole={gaps[gaps.length - 1]?.targetRole}
                  currentSkills={resumes[resumes.length - 1]?.skillsDetected}
                />
              )}

              {activeTab === 'interviews' && (
                <InterviewCoach
                  token={token}
                  interviews={interviews}
                  onInterviewSaved={(newI) => setInterviews([...interviews, newI])}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectRecommender
                  token={token}
                  resumes={resumes}
                />
              )}

              {activeTab === 'github' && (
                <GitHubAnalyzer
                  token={token}
                />
              )}

              {activeTab === 'linkedin' && (
                <LinkedInOptimizer
                  token={token}
                />
              )}

              {activeTab === 'admin' && (
                <AdminPanel
                  token={token}
                  currentUser={user || { id: 'guest', name: 'Guest', email: '', role: 'student', subscription: 'free', createdAt: '' }}
                  onSimulateAdmin={() => {
                    if (user) {
                      const updated = { ...user, role: 'admin' as const };
                      setUser(updated);
                    }
                  }}
                />
              )}

              {user && activeTab === 'settings' && (
                <Settings
                  token={token}
                  currentUser={user}
                  onUpdateUser={(updated) => setUser(updated)}
                />
              )}
            </main>
          </div>

        </div>
      )}

      {/* 3. Global Authentication Modal Popup */}
      {authModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900/95 border border-zinc-800 p-6.5 text-zinc-200 shadow-2xl relative space-y-4 backdrop-blur">
            
            <button
              type="button"
              onClick={() => {
                setAuthModal({ isOpen: false, isSignup: false });
                setAuthError('');
              }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-zinc-805 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <h3 className="text-lg font-black tracking-tight text-white">
                {authModal.isSignup ? 'Register New Account' : 'Sign In To CareerPilot'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Enter your simulated sandbox credentials below
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 pt-1">
              {authModal.isSignup && (
                <div className="space-y-1.5">
                  <label htmlFor="auth-name" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Charan Kumar"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200 font-medium"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="e.g. charan21003@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-password" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password parameter holds mock parity"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 text-zinc-200 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer text-center animate-pulse-glow"
              >
                {authModal.isSignup ? 'Confirm Registration' : 'Authenticate Credentials'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setAuthModal({ ...authModal, isSignup: !authModal.isSignup })}
                className="text-[11px] text-zinc-400 hover:text-indigo-400 cursor-pointer text-center"
              >
                {authModal.isSignup ? 'Already have an account? Sign In' : 'Need an account? Start Registration'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
