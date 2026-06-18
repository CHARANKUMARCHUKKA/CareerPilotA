/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Layers, 
  Calendar, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { ProjectRecommendation, ResumeAnalysis } from '../types';

interface ProjectRecommenderProps {
  token: string | null;
  resumes: ResumeAnalysis[];
}

export default function ProjectRecommender({ token, resumes }: ProjectRecommenderProps) {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectRecommendation[]>([]);

  const handleRecommend = async () => {
    setLoading(true);
    
    const skills = resumes.length > 0 
      ? resumes[resumes.length - 1].skillsDetected 
      : ['React', 'TypeScript', 'Node.js', 'Express', 'SQL', 'Git'];

    try {
      const response = await fetch('/api/projects/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'default-user'}`
        },
        body: JSON.stringify({
          targetRole,
          currentSkills: skills
        })
      });

      if (!response.ok) throw new Error(await response.text());
      const data: ProjectRecommendation[] = await response.json();
      setProjects(data);
    } catch (err: any) {
      alert('Failed to get project recommendations: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="project-recommender">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">AI Project Recommender</h1>
        <p className="text-sm text-zinc-400 mt-1">Get customized full-stack project layouts designed to maximize your CV search priority value.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left target form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4 backdrop-blur">
            <h3 className="text-sm font-semibold text-zinc-200">Compile Recommendations</h3>
            
            <div className="space-y-1.5">
              <label htmlFor="p-role-input" className="text-[11px] uppercase font-bold font-mono tracking-wider text-zinc-500">Target Role</label>
              <input
                id="p-role-input"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Machine Learning Engineer"
                className="w-full bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <button
              type="button"
              disabled={loading || !targetRole.trim()}
              onClick={handleRecommend}
              className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-50 transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer animate-pulse-glow"
            >
              Recommend Projects <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Recommended projects lists view */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="p-12 rounded-2xl bg-zinc-90 w/10 bg-zinc-900/10 border border-zinc-800 min-h-[350px] flex flex-col items-center justify-center text-center">
              <div className="w-9 h-9 rounded-full border-2 border-t-indigo-500 border-zinc-800 animate-spin" />
              <p className="text-xs text-zinc-450 font-semibold mt-4 animate-pulse text-zinc-400">Running architectural designs compilation generator...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-6">
              {projects.map((proj, idx) => (
                <div key={proj.id} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-lg space-y-5 relative overflow-hidden group backdrop-blur">
                  <div className="absolute top-0 right-0 p-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black font-mono uppercase tracking-widest ${
                      proj.difficulty === 'Beginner'
                        ? 'bg-blue-500/10 text-blue-300 border border-blue-500/15'
                        : proj.difficulty === 'Intermediate'
                        ? 'bg-teal-500/10 text-teal-300 border border-teal-500/15'
                        : proj.difficulty === 'Advanced'
                        ? 'bg-purple-500/10 text-purple-300 border border-purple-500/15'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}>
                      {proj.difficulty} Tier
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-100">{proj.title}</h3>
                    <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed font-sans">{proj.description}</p>
                  </div>

                  {/* Tech stack badge grid */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-wider">Recommended Tech Stack & Architecture</span>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 font-mono text-[10px]">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/60 text-xs">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Modular Architecture flow-blocks:</span>
                      <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[10px] font-bold text-zinc-300">
                        {proj.architecture.map((arch, aIdx) => (
                          <React.Fragment key={arch}>
                            <span className="px-2 py-0.5 rounded border border-zinc-800/80 bg-zinc-950 text-zinc-400">{arch}</span>
                            {aIdx < proj.architecture.length - 1 && <ChevronRight className="w-3 h-3 text-zinc-650 text-zinc-500 flex-shrink-0" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CV line optimizer value */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-wider">Strategic CV bullet optimizer line</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium italic border-l-2 border-indigo-500/50 pl-3.5 mt-1.5 py-0.5">
                      "{proj.resumeValue}"
                    </p>
                  </div>

                  {/* Estimation footer details */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider pt-2 border-t border-zinc-800/40">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Estimated Timeframe: {proj.timeline}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800 min-h-[350px] flex flex-col items-center justify-center text-center backdrop-blur">
              <Briefcase className="w-10 h-10 text-zinc-650 text-zinc-500 mb-4" />
              <h3 className="font-semibold text-white">No recommended project compiled yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                Trigger the AI architect recommender using the target parameters to inspect full tech stack details.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
