import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckSquare,
  Award,
  Download,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import { CareerRoadmap, MonthPlan, WeekPlan, Task } from '../types';

interface RoadmapGeneratorProps {
  token: string | null;
  gapsRole?: string;
  gapsSkills?: string[];
  roadmaps: CareerRoadmap[];
  onRoadmapGenerated: (roadmap: CareerRoadmap) => void;
  onUpdateRoadmap: (roadmapId: string, updatedMonths: MonthPlan[]) => void;
}

export default function RoadmapGenerator({
  token,
  gapsRole = '',
  gapsSkills = [],
  roadmaps,
  onRoadmapGenerated,
  onUpdateRoadmap
}: RoadmapGeneratorProps) {
  const [targetRole, setTargetRole] = useState(gapsRole || 'Full Stack Developer');
  const [timeframe, setTimeframe] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(
    roadmaps.length > 0 ? roadmaps[roadmaps.length - 1].id : null
  );

  const [expandedMonthNumber, setExpandedMonthNumber] = useState<number>(1);

  const selectedRoadmap = roadmaps.find(r => r.id === selectedRoadmapId) || roadmaps[roadmaps.length - 1];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/roadmaps/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'default-user'}`
        },
        body: JSON.stringify({
          targetRole,
          timeframeMonths: timeframe,
          currentSkills: [],
          missingSkills: gapsSkills.length > 0 ? gapsSkills : ['AWS S3', 'Docker', 'Redis', 'Unit Testing', 'Tailwind']
        })
      });

      if (!response.ok) throw new Error(await response.text());
      const res: CareerRoadmap = await response.json();
      onRoadmapGenerated(res);
      setSelectedRoadmapId(res.id);
      setExpandedMonthNumber(1);
    } catch (err: any) {
      alert('Failed to generate roadmap: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (monthIdx: number, weekIdx: number, taskIdx: number) => {
    if (!selectedRoadmap) return;
    const updatedMonths = JSON.parse(JSON.stringify(selectedRoadmap.months));
    const targetTask = updatedMonths[monthIdx].weeks[weekIdx].tasks[taskIdx];
    targetTask.completed = !targetTask.completed;
    onUpdateRoadmap(selectedRoadmap.id, updatedMonths);
  };

  // Progress calculations
  let totalTasks = 0;
  let completedTasks = 0;
  if (selectedRoadmap) {
    selectedRoadmap.months.forEach(m => {
      m.weeks.forEach(w => {
        w.tasks.forEach(t => {
          totalTasks++;
          if (t.completed) completedTasks++;
        });
      });
    });
  }
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const downloadRoadmapChecksList = () => {
    if (!selectedRoadmap) return;

    let content = `CAREERPILOT AI - PORTABLE DETAILED ROADMAP PLAN\n`;
    content += `==========================================\n`;
    content += `Target Placement: ${selectedRoadmap.targetRole}\n`;
    content += `Timeframe: ${selectedRoadmap.timeframeMonths} Months | Core Focus: ${selectedRoadmap.focusArea}\n`;
    content += `Generated At: ${new Date(selectedRoadmap.createdAt).toLocaleDateString()}\n\n`;

    selectedRoadmap.months.forEach(m => {
      content += `MONTH ${m.monthNumber} - FOCUS: ${m.focus}\n`;
      content += `------------------------------------------\n`;
      m.weeks.forEach(w => {
        content += `- Week ${w.weekNumber}: ${w.focus}\n`;
        w.tasks.forEach(t => {
          content += `  [${t.completed ? 'X' : ' '}] (${t.type.toUpperCase()}) ${t.title} - ${t.description}\n`;
          content += `      * Deadline: Due in ${(m.monthNumber - 1) * 30 + w.weekNumber * 7} Days\n`;
          content += `      * Suggested Docs: read-documentation-v3-resources\n`;
        });
      });
      content += `\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareerPilot_Roadmap_${selectedRoadmap.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="roadmap-generator">
      <div className="flex justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5.5 h-5.5 text-indigo-400" /> AI Interactive Roadmap Generator
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Formulate chronologically structured learning pathways of month-by-month tasks matching your goal benchmarks.
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-505 bg-indigo-505 bg-indigo-500/10 border border-indigo-500/25 rounded-lg text-[10px] font-mono tracking-wider text-indigo-300 font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Chrono Gen V2
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left configurations inputs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5.5 rounded-2xl bg-zinc-900/50 border border-zinc-805 border-zinc-800 space-y-4 backdrop-blur">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono">Plan Parameters</h3>
            
            <div className="space-y-1.5">
              <label htmlFor="target-role" className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-500">Target Role Goal</label>
              <input
                id="target-role"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Staff AI Dev"
                className="w-full bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-lg text-xs py-2 px-3.5 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-500 block">Plan timeframe months</span>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTimeframe(m)}
                    className={`py-1.5 rounded-xl border text-xs font-semibold active:scale-95 transition cursor-pointer font-mono ${
                      timeframe === m 
                        ? 'bg-indigo-600 border-indigo-550 text-white' 
                        : 'bg-zinc-950/60 border-zinc-858 border-zinc-808 border-zinc-800 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    {m} Mos
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={loading || !targetRole.trim()}
              onClick={handleGenerate}
              className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1"
            >
              Compile Growth Timeline <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Timelines history selection panel */}
          {roadmaps.length > 1 && (
            <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-c800 border-zinc-800 backdrop-blur">
              <span className="text-[9px] uppercase font-bold tracking-wider font-mono text-zinc-500 block mb-2">Saved Timelines logs</span>
              <div className="space-y-1.5">
                {roadmaps.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRoadmapId(r.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold cursor-pointer flex justify-between items-center transition ${
                      selectedRoadmapId === r.id 
                        ? 'bg-zinc-800 text-white font-bold' 
                        : 'text-zinc-405 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-90 w/40 hover:bg-zinc-900/40'
                    }`}
                  >
                    <span>{r.targetRole}</span>
                    <span className="text-[9.5px] uppercase font-mono text-indigo-400">{r.timeframeMonths} Mo</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right timeline feedback displays */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="p-12 rounded-2xl bg-zinc-90 w/10 border border-zinc-800 min-h-[350px] flex flex-col items-center justify-center text-center backdrop-blur">
              <div className="w-8 h-8 rounded-full border-2 border-t-indigo-500 border-zinc-850 animate-spin" />
              <p className="text-xs text-zinc-400 font-semibold mt-4 animate-pulse">Assembling customized cron action steps...</p>
            </div>
          ) : selectedRoadmap ? (
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-808 border-zinc-800 backdrop-blur space-y-6">
              
              {/* Header metrics details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-zinc-800 gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5 tracking-wide">
                    {selectedRoadmap.targetRole} Blueprint <Sparkles className="w-4 h-4 text-indigo-455 text-indigo-400 animate-pulse" />
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm">Focus Core: {selectedRoadmap.focusArea}</p>
                </div>

                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
                  <div className="flex justify-between sm:justify-end items-center gap-2.5 text-xs text-zinc-405 text-zinc-400">
                    <span>Task progress:</span>
                    <strong className="text-indigo-400 font-bold font-mono">{progressPercent}% ({completedTasks}/{totalTasks})</strong>
                  </div>
                  
                  <div className="w-full sm:w-44 h-2 bg-zinc-950 rounded-full overflow-hidden flex">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                  
                  <button
                    type="button"
                    onClick={downloadRoadmapChecksList}
                    className="mt-1 text-[10px] font-mono font-bold uppercase text-indigo-400 hover:text-indigo-300 flex items-center gap-1 leading-none select-none cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Save checklist logs
                  </button>
                </div>
              </div>

              {/* Month selecting bar strip */}
              <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                {selectedRoadmap.months.map((m) => (
                  <button
                    key={m.monthNumber}
                    type="button"
                    onClick={() => setExpandedMonthNumber(m.monthNumber)}
                    className={`py-2 px-4 rounded-xl text-[11px] font-semibold active:scale-95 transition whitespace-nowrap cursor-pointer ${
                      expandedMonthNumber === m.monthNumber
                        ? 'bg-indigo-600 text-white shadow shadow-indigo-600/10'
                        : 'bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Month {m.monthNumber}: {m.focus.length > 20 ? `${m.focus.substr(0, 18)}...` : m.focus}
                  </button>
                ))}
              </div>

              {/* Month Plan Rendering */}
              {selectedRoadmap.months.filter(m => m.monthNumber === expandedMonthNumber).map((month) => {
                const origMonthIdx = selectedRoadmap.months.findIndex(m => m.monthNumber === expandedMonthNumber);
                
                return (
                  <div key={month.monthNumber} className="space-y-6">
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-400 flex items-center gap-1 font-mono uppercase tracking-widest text-[9px]">
                        <Calendar className="w-3.5 h-3.5" /> Month {month.monthNumber} focus target
                      </span>
                      <strong className="text-zinc-200 font-bold">{month.focus}</strong>
                    </div>

                    <div className="border-l-2 border-zinc-808 border-zinc-800 ml-3 pl-6 space-y-8 relative">
                      {month.weeks.map((week, wIdx) => (
                        <div key={week.weekNumber} className="space-y-3 relative">
                          
                          {/* Circle node dot inside vertical timeline */}
                          <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-indigo-500 bg-zinc-950 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          </div>

                          <div className="flex justify-between items-baseline text-xs pb-1 border-b border-zinc-850">
                            <h4 className="font-bold text-zinc-200 font-mono">WEEK {week.weekNumber}: {week.focus}</h4>
                            <span className="font-mono text-[9px] text-zinc-550 text-zinc-500">
                              Deadline: due in {((month.monthNumber - 1) * 30 + week.weekNumber * 7)} Days
                            </span>
                          </div>

                          {/* Task details cards list */}
                          <div className="grid grid-cols-1 gap-2.5">
                            {week.tasks.map((task, tIdx) => (
                              <div
                                key={task.id}
                                className={`p-4 rounded-xl border flex justify-between items-start gap-4 transition ${
                                  task.completed 
                                    ? 'bg-zinc-900/30 border-zinc-800/40 opacity-55' 
                                    : 'bg-zinc-950/60 border-zinc-850 hover:border-zinc-750'
                                }`}
                              >
                                <div className="flex gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleTask(origMonthIdx, wIdx, tIdx)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition ${
                                      task.completed 
                                        ? 'bg-indigo-600 border-indigo-400 text-white font-bold' 
                                        : 'border-zinc-750 hover:border-zinc-500 bg-zinc-950'
                                    }`}
                                  >
                                    {task.completed && <span className="text-[10px] font-bold">✓</span>}
                                  </button>
                                  
                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className={`text-xs font-bold ${task.completed ? 'line-through text-zinc-550 text-zinc-550 text-zinc-500 font-medium' : 'text-zinc-205 text-zinc-300'}`}>
                                        {task.title}
                                      </span>
                                      <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold tracking-wider bg-zinc-800/80 text-zinc-400">
                                        Type: {task.type}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-455 text-zinc-400 leading-relaxed pt-0.5">
                                      {task.description}
                                    </p>
                                    
                                    {/* Dedicated learning resources link blocks */}
                                    <div className="pt-2 flex items-center gap-1.5 text-[10px] font-semibold font-mono text-indigo-400">
                                      <BookOpen className="w-3.5 h-3.5" />
                                      <span>Recommended Resource: <a href="https://example.com/learn" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-300">read-documentation-v3-resources</a></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}

            </div>
          ) : (
            <div className="p-12 border border-zinc-808 border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center min-h-[350px]">
              <Calendar className="w-12 h-12 text-zinc-700 mb-4" />
              <h4 className="font-semibold text-white">No active roadmap compiled</h4>
              <p className="text-xs text-zinc-555 text-zinc-505 text-zinc-500 max-w-sm mt-1 leading-relaxed">
                Enter your desired timeframe above and compile to generate structured checklist guides.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
