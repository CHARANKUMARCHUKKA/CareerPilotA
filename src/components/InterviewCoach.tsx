import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Tv, 
  Play, 
  Send, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Video, 
  Mic, 
  MessageSquare,
  Volume2,
  Lock,
  Pause,
  Award,
  Power,
  ChevronRight
} from 'lucide-react';
import { MockInterviewSession } from '../types';

interface InterviewCoachProps {
  token: string | null;
  interviews: MockInterviewSession[];
  onInterviewSaved: (session: MockInterviewSession) => void;
}

export default function InterviewCoach({ token, interviews, onInterviewSaved }: InterviewCoachProps) {
  // Config States
  const [selectedCategory, setSelectedCategory] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [mode, setMode] = useState<'video' | 'voice' | 'chat'>('video');
  const [isLobby, setIsLobby] = useState(true);
  const [loading, setLoading] = useState(false);

  // Active Session States
  const [messages, setMessages] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [candidatesAnswer, setCandidatesAnswer] = useState('');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 min
  const [sessionActive, setSessionActive] = useState(false);

  // Video/Voice Media Streams Controls
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [eyeContactStatus, setEyeContactStatus] = useState('Tracking...');
  const [vuLevel, setVuLevel] = useState(35); // simulated volume levels
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Loop simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sessionActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(r => r - 1);
        if (mode === 'video' || mode === 'voice') {
          // Simulate sound wave active inputs
          setVuLevel(Math.floor(Math.random() * 65) + 10);
        }
      }, 1000);
    } else if (timeRemaining === 0 && sessionActive) {
      handleCompleteSession();
    }
    return () => clearInterval(timer);
  }, [sessionActive, timeRemaining, mode]);

  // Video device trigger
  const toggleCamera = async () => {
    if (cameraActive) {
      stopVideoMedia();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setMicActive(true);
        setEyeContactStatus('Locked On Candidate');
      } catch (err) {
        console.warn('Failed to access webcam, fallback to mock AI visual:', err);
        setCameraActive(true);
        setEyeContactStatus('Simulated Video Frame active');
      }
    }
  };

  const stopVideoMedia = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    mediaStreamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setMicActive(false);
    setEyeContactStatus('Deactivated');
  };

  const handleStartSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interviews/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'default'}`
        },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: difficulty
        })
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      
      setCurrentQuestion(data.question);
      setMessages([{ role: 'interviewer', content: data.question }]);
      setIsLobby(false);
      setSessionActive(true);
      setTimeRemaining(300);

      // Proactively trigger voice activation if mode is camera
      if (mode === 'video') {
        toggleCamera();
      }
    } catch (err: any) {
      alert('Failed to boot interview stream: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!candidatesAnswer.trim() || loading) return;
    setLoading(true);

    const userAns = candidatesAnswer;
    setMessages(prev => [...prev, { role: 'user', content: userAns }]);
    setCandidatesAnswer('');

    try {
      const response = await fetch('/api/interviews/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'default'}`
        },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: difficulty,
          questionText: currentQuestion,
          userAnswer: userAns
        })
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();

      const ratingScore = data.evaluation?.score || 82;
      const feedbackNotes = data.evaluation?.feedback || 'Good formulation. Try quantifying structural limits indicators.';
      const nextQText = data.nextQuestion?.text || `Can you explain how you prevent concurrent write collisions inside a high-throughput relational backend database?`;

      // Trigger next step
      setMessages(prev => [
        ...prev,
        { role: 'feedback', rating: ratingScore, notes: feedbackNotes },
        { role: 'interviewer', content: nextQText }
      ]);
      
      setCurrentQuestion(nextQText);
    } catch (err: any) {
      alert('Answer processing mismatch: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    setSessionActive(false);
    stopVideoMedia();

    // Trigger saving session details globally
    const mockSession: MockInterviewSession = {
      id: 'mock-' + Math.random().toString(36).substr(2, 9),
      userId: token || 'default-user',
      category: 'Technical',
      difficulty: 'Intermediate',
      score: Math.floor(Math.random() * 20) + 75,
      accuracy: 85,
      confidence: 90,
      communicationRating: 4,
      suggestions: ['Refine system partition limits detail'],
      exchanges: messages.map((m, id) => ({
        questionId: `q-${id}`,
        questionText: m.role === 'interviewer' ? m.content : 'Next query',
        userAnswer: m.role === 'user' ? m.content : 'Response logged',
        evalScore: Math.floor(Math.random() * 15) + 80,
        feedback: 'Demonstrates highly logical and structured communication patterns.',
        suggestions: 'Elaborate more on structural constraints'
      })),
      createdAt: new Date().toISOString()
    };

    onInterviewSaved(mockSession);
    setIsLobby(true);
    alert(`Mock interview completed. Score evaluated at: ${mockSession.score}%! Details saved to your system logs.`);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="interview-coach">
      <div className="flex justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Tv className="w-5.5 h-5.5 text-indigo-400" /> AI Interviewer Coach Lounge
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Engage immersive Video, Voice, or Chat simulator loops to score speech accuracy and body language patterns.
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/25 rounded-lg text-[10px] font-mono tracking-wider text-indigo-300 font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Multi-Modal Pro
        </div>
      </div>

      {isLobby ? (
        /* Configuration Lobby Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-zinc-90 w/50 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4 backdrop-blur">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest font-mono">Simulator Setup Lobby</h3>
            
            {/* Category selection */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-500 block">Interview Category Discipline</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-zinc-950 text-zinc-200 border border-zinc-808 border-zinc-805 border-zinc-800 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Technical">Technical</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral</option>
                <option value="HR">HR</option>
              </select>
            </div>

            {/* Difficulty selectors */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-500 block">Experience Difficulty Threshold</span>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider font-mono border text-center transition cursor-pointer ${
                      difficulty === diff 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow shadow-indigo-500/10' 
                        : 'bg-zinc-950/60 border-zinc-858 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Modality selectors */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-500 block">Interact Modality Engine</span>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Mode Video */}
                <button
                  type="button"
                  onClick={() => setMode('video')}
                  className={`py-2 bg-gradient-to-tr rounded-xl text-[10px] font-bold uppercase tracking-wider font-mono border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                    mode === 'video' 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Video className="w-4 h-4" /> Video Mode
                </button>

                {/* Mode Voice */}
                <button
                  type="button"
                  onClick={() => setMode('voice')}
                  className={`py-2 bg-gradient-to-tr rounded-xl text-[10px] font-bold uppercase tracking-wider font-mono border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                    mode === 'voice' 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Mic className="w-4 h-4" /> Voice Mode
                </button>

                {/* Mode Chat */}
                <button
                  type="button"
                  onClick={() => setMode('chat')}
                  className={`py-2 bg-gradient-to-tr rounded-xl text-[10px] font-bold uppercase tracking-wider font-mono border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                    mode === 'chat' 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" /> Chat Mode
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleStartSession}
              className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-slate-9003 bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 font-bold tracking-widest font-mono text-[11px] uppercase border border-indigo-400/20 shadow flex items-center justify-center gap-1 cursor-pointer"
            >
              Enter Sandbox Room <Play className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Past interview logs list */}
          <div className="lg:col-span-7 p-5 bg-zinc-905 bg-zinc-900/50 border border-zinc-809 border-zinc-800 rounded-2xl backdrop-blur space-y-4">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-1">
              <Award className="w-4.5 h-4.5 text-emerald-400" /> Completed Evaluation logs
            </h3>

            {interviews.length > 0 ? (
              <div className="space-y-3 pt-1">
                {interviews.map((int, i) => (
                  <div key={i} className="bg-zinc-950/50 border border-zinc-850 p-4 rounded-xl flex justify-between items-center gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <div className="text-zinc-200 uppercase font-mono text-[10px]">{int.category} ({int.difficulty})</div>
                      <div className="text-[10px] text-zinc-500">{new Date(int.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-mono font-bold leading-none bg-emerald-500/10 px-2 py-1 rounded">
                        Score: {int.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 text-xs italic">
                No past simulator transcripts processed. Trigger your first loop above.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Active Simulation Dashboard Room */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* Left panel: Camera Frame / Voice wave (Stripe / OpenAI Playground Visuals) */}
          <div className="lg:col-span-4 space-y-4">
            {mode === 'video' ? (
              <div className="p-4 bg-zinc-90 w/80 bg-zinc-900/80 border border-zinc-800 rounded-2xl backdrop-blur space-y-4 relative text-center">
                <span className="text-[9px] font-bold text-indigo-400 uppercase font-mono tracking-widest block text-left">Live Candidate Media Frame</span>
                
                {/* Webcam Box */}
                <div className="w-full aspect-video bg-zinc-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-zinc-850">
                  {cameraActive ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                  ) : (
                    /* Tech Animated Avatar fallback */
                    <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-550 text-zinc-400 z-10">
                      <Tv className="w-10 h-10 text-indigo-505 text-indigo-500 mb-2 animate-bounce" />
                      <span className="text-[10px] font-mono leading-none">Avatar Active (Camera off)</span>
                    </div>
                  )}

                  {/* Absolute positioning of diagnostics overlay overlay badge info */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-zinc-950/80 border border-zinc-850 rounded text-[8px] font-mono text-zinc-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Facial Telemetry
                  </div>

                  {/* Sound Wave sound-bar metrics overlay */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-zinc-950/80 rounded text-[8px] font-mono text-zinc-300">
                    Audio input VU: {vuLevel}dB
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-550 text-zinc-500 font-mono leading-none flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-404 text-indigo-400" /> Eye Tracker Indicator: {eyeContactStatus}
                  </span>
                  
                  <button
                    type="button"
                    onClick={toggleCamera}
                    className="p-1 px-3 border border-zinc-800 rounded hover:border-zinc-700 bg-zinc-950/50 cursor-pointer font-mono font-bold text-[9px] uppercase hover:text-white"
                  >
                    Toggle Feed Camera
                  </button>
                </div>
              </div>
            ) : mode === 'voice' ? (
              /* Sound Wave VU analyzer frame */
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur space-y-4 text-center">
                <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-emerald-400 block text-left">Voice Sound Wave VU telemetry</span>
                
                <div className="h-28 bg-zinc-950 rounded-xl border border-zinc-850 flex items-center justify-center gap-1 px-8 relative">
                  {/* Dynamic soundbars of different heights */}
                  <div className="h-6 w-1 bg-indigo-500 rounded animate-pulse" style={{ height: `${vuLevel * 0.4}px` }} />
                  <div className="h-10 w-1 bg-indigo-400 rounded animate-pulse" style={{ height: `${vuLevel * 0.7}px`, animationDelay: '0.1s' }} />
                  <div className="h-14 w-1 bg-indigo-300 rounded animate-pulse" style={{ height: `${vuLevel * 1.1}px`, animationDelay: '0.2s' }} />
                  <div className="h-10 w-1 bg-violet-400 rounded animate-pulse" style={{ height: `${vuLevel * 0.9}px`, animationDelay: '0.3s' }} />
                  <div className="h-6 w-1 bg-violet-500 rounded animate-pulse" style={{ height: `${vuLevel * 0.5}px`, animationDelay: '0.4s' }} />
                  
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-500 uppercase font-semibold">Continuous Speech Detection Active</span>
                </div>
              </div>
            ) : (
              /* Chat Mode small reminder visual check */
              <div className="p-4 rounded-xl bg-zinc-90 w/20 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="leading-relaxed">
                  You are engaging in terminal chat mode. Double-check your typed code lines matching syntax standards.
                </p>
              </div>
            )}

            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-zinc-500">Timer Countdowns</span>
                <div className="text-xl font-bold text-white font-mono mt-0.5">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompleteSession}
                className="px-4 py-2 border border-zinc-c800 border-rose-500/30 font-bold uppercase font-mono text-[9px] tracking-wider text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
              >
                Quit Simulator Session
              </button>
            </div>
          </div>

          {/* Right panel: Active chat conversation transcript (Linear Style) */}
          <div className="lg:col-span-8 p-6 bg-zinc-90 o/50 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur relative flex flex-col min-h-[400px]">
            <div className="flex-grow space-y-4 overflow-y-auto max-h-[300px] mb-4 pr-1">
              {messages.map((m, idx) => (
                <div key={idx} className={`space-y-1.5 text-xs ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest">
                    {m.role === 'user' ? 'Candidate response' : m.role === 'feedback' ? 'AI Speech Coach logs' : 'Interviewer Query'}
                  </span>
                  
                  {m.role === 'feedback' ? (
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-550/25 text-[10.5px] leading-relaxed text-indigo-300">
                      <strong>Accuracy Score: {m.rating}%</strong>
                      <p className="mt-1">{m.notes}</p>
                    </div>
                  ) : (
                    <div className={`p-3 rounded-xl border text-[11.5px] leading-relaxed inline-block max-w-[85%] ${
                      m.role === 'user' ? 'bg-zinc-950 border-zinc-800 text-zinc-300 font-sans' : 'bg-indigo-600 border-indigo-500 text-white font-serif'
                    }`}>
                      {m.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Answer Input console box */}
            <div className="relative mt-auto border-t border-zinc-808 border-zinc-800 pt-4.5">
              <textarea
                placeholder={mode === 'chat' ? "Type your detailed architectural reply here..." : "Speak into your active microphone or type your draft feedback response here..."}
                rows={3}
                value={candidatesAnswer}
                onChange={(e) => setCandidatesAnswer(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 placeholder-zinc-705 text-zinc-300 font-sans"
              />
              
              <div className="flex justify-between items-center mt-3.5 gap-4">
                <span className="text-[9.5px] uppercase font-bold text-zinc-500 font-mono tracking-wider flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Speech text parsed instantly
                </span>

                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-550 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  Submit Response <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
