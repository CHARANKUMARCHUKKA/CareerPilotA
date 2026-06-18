/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { 
  User, 
  ResumeAnalysis, 
  GapAnalysis, 
  CareerRoadmap, 
  MockInterviewSession, 
  ProjectRecommendation,
  PlatformStat,
  InterviewExchange
} from './src/types';

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

// Increase request size limits for handling base64 PDF uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Google GenAI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Simple In-Memory DB
const db = {
  users: [
    {
      id: 'default-user',
      email: 'charan21003@gmail.com',
      name: 'Charan Kumar',
      role: 'student',
      subscription: 'free',
      createdAt: new Date().toISOString()
    } as User,
    {
      id: 'admin-user',
      email: 'admin@careerpilot.ai',
      name: 'Admin Chief',
      role: 'admin',
      subscription: 'enterprise',
      createdAt: new Date().toISOString()
    } as User
  ] as User[],
  
  resumes: [
    {
      id: 'mock-resume-1',
      userId: 'default-user',
      fileName: 'charan_software_intern_resume.pdf',
      atsScore: 78,
      skillsDetected: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL', 'HTML/CSS', 'Git'],
      missingSkills: ['Tailwind CSS', 'Docker', 'AWS Secrets Manager', 'Redis', 'Unit Testing'],
      strengths: [
        'Solid React and TypeScript foundational framework skillset',
        'Demonstrates clean architecture patterns and full-stack backend APIs',
        'Active developer portfolio and git experience'
      ],
      weaknesses: [
        'Lacks cloud deployment orchestration context (AWS/S3/Docker)',
        'No testing experience indicated on the current profile',
        'Lacking Tailwind CSS and styling framework specifications'
      ],
      suggestions: [
        'Integrate Tailwind CSS on current active projects to match fast-paced startup requirements',
        'Add a Docker containerization segment to existing repository descriptions',
        'Include mock data seeding with Jest/Mocha tests to prove production confidence'
      ],
      parsedContent: 'Charan Kumar - Software Engineering Student. Passionate about Full Stack modern React architectures, server routing, and scalable TypeScript applications.',
      createdAt: new Date().toISOString()
    } as ResumeAnalysis
  ],
  
  gapAnalyses: [
    {
      id: 'mock-gap-1',
      userId: 'default-user',
      targetRole: 'Full Stack Developer',
      currentSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL', 'HTML/CSS', 'Git'],
      missingSkills: ['Tailwind CSS', 'Docker', 'AWS S3', 'Redis', 'Jest'],
      marketDemand: 'High',
      learningPriority: [
        { skill: 'Tailwind CSS', priority: 'High', reason: 'High demand for high-fidelity interactive client styles with modern layout models.' },
        { skill: 'Docker', priority: 'High', reason: 'Essential for containerizing server routing platforms in enterprise pipelines.' },
        { skill: 'AWS S3', priority: 'Medium', reason: 'Commonly queried for high-performance assets and document repositories.' }
      ],
      createdAt: new Date().toISOString()
    } as GapAnalysis
  ],
  
  roadmaps: [
    {
      id: 'mock-roadmap-1',
      userId: 'default-user',
      targetRole: 'Full Stack Developer',
      timeframeMonths: 3,
      focusArea: 'Bridging developer skill gaps to enterprise production readiness',
      months: [
        {
          monthNumber: 1,
          focus: 'Advanced Styling & Styling Architecture integration',
          weeks: [
            {
              weekNumber: 1,
              focus: 'Tailwind CSS fluid layout design grid systems',
              tasks: [
                { id: 't1', title: 'Complete Tailwind CSS interactive styling sandbox', description: 'Build a grid system mimicking Linear/Stripe design systems with light/dark contrast pairings.', completed: true, type: 'course' },
                { id: 't2', title: 'Refactor current React widgets to use tailwindcss', description: 'Replace custom style sheets or vanilla inputs with utility classes.', completed: false, type: 'project' }
              ]
            },
            {
              weekNumber: 2,
              focus: 'Transition animations with Motion/Framer SDK',
              tasks: [
                { id: 't3', title: 'Build clean animation layouts', description: 'Incorporate layout animations on active lists and sidebar containers.', completed: false, type: 'practice' }
              ]
            }
          ]
        }
      ],
      createdAt: new Date().toISOString()
    } as CareerRoadmap
  ],
  
  interviews: [
    {
      id: 'mock-interview-1',
      userId: 'default-user',
      category: 'Technical',
      difficulty: 'Intermediate',
      score: 82,
      accuracy: 85,
      confidence: 80,
      communicationRating: 84,
      suggestions: [
        'Great breakdown of state synchronization constraints in React 19.',
        'Consider elaborating specifically on CORS and reverse-proxying with Nginx for server routing.'
      ],
      exchanges: [
        {
          questionId: 'q1',
          questionText: 'Explain the difference between useEffect layout changes and basic state updates in React.',
          userAnswer: 'basic state updates schedules a re-render asynchronously while useEffect handles downstream side effects after rendering paint cycles.',
          evalScore: 85,
          feedback: 'Accurate distinction of client execution contexts.',
          suggestions: 'Consider mentioning useLayoutEffect for layout measurement calculations.'
        }
      ],
      createdAt: new Date().toISOString()
    } as MockInterviewSession
  ],
  
  projects: [] as ProjectRecommendation[],
  
  reports: [] as any[],
  auditLogs: [] as any[]
};

// Seed initial reports and logs
db.auditLogs.push({
  timestamp: new Date().toISOString(),
  action: 'Platform initialized',
  details: 'CareerPilot AI backend server successfully seeded with mock analytics data.'
});

// Helper: Find user by session/header simulated
function getCurrentUser(req: express.Request): User {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const found = db.users.find(u => u.email === token || u.id === token);
    if (found) return found;
  }
  return db.users[0]; // Fallback to default user for premium workspace ease of testing
}

// REST Best Practice API Endpoints

// 1. JWT / Auth
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'This email is already registered.' });
  }
  
  const newUser: User = {
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    email,
    name,
    role: email.includes('admin') ? 'admin' : 'student',
    subscription: 'free',
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  db.auditLogs.push({
    timestamp: new Date().toISOString(),
    action: 'User Registered',
    details: `Name: ${name}, Email: ${email}`
  });
  
  res.json({ token: newUser.email, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  
  const found = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!found) {
    // If it's a first time, we can auto-register or return error
    return res.status(400).json({ error: 'No account registered with this email. Please check your credentials or register.' });
  }
  
  db.auditLogs.push({
    timestamp: new Date().toISOString(),
    action: 'User Logged In',
    details: `Email: ${email}`
  });
  
  res.json({ token: found.email, user: found });
});

app.get('/api/auth/me', (req, res) => {
  const user = getCurrentUser(req);
  res.json({ user });
});

app.post('/api/auth/update-subscription', (req, res) => {
  const user = getCurrentUser(req);
  const { tier } = req.body;
  if (user && (tier === 'free' || tier === 'pro' || tier === 'enterprise')) {
    user.subscription = tier;
    // Sync with DB
    const index = db.users.findIndex(u => u.id === user.id);
    if (index !== -1) db.users[index] = user;
    
    db.auditLogs.push({
      timestamp: new Date().toISOString(),
      action: 'Subscription Upgraded',
      details: `User: ${user.email}, Tier: ${tier}`
    });
    return res.json({ success: true, user });
  }
  res.status(400).json({ error: 'Invalid subscription tier' });
});

// Reset password mockup
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({ message: `A secure reset password verification code has been simulated for ${email}.` });
});

// Resume Analyzer
app.post('/api/resume/analyze', async (req, res) => {
  const user = getCurrentUser(req);
  const { fileName, fileContent, rawText } = req.body;
  
  if (!fileContent && !rawText) {
    return res.status(400).json({ error: 'Resume PDF base64 file content or raw text is required.' });
  }
  
  try {
    let contents: any[] = [];
    let promptSubject = "";
    
    if (fileContent) {
      // Direct Native PDF analysis with Gemini!
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: fileContent // base64 string
        }
      });
      promptSubject = "this attached PDF Resume file";
    } else {
      contents.push({
        text: rawText
      });
      promptSubject = "this plaintext resume contents";
    }
    
    const prompt = `You are an expert Talent Acquisition leader and ATS Scoring Optimizer. Analyze ${promptSubject}.
    Provide a comprehensive, production-grade review including:
    1. ATS compatibility score (0-100 index based on core modern startup and tech requirements).
    2. Exact named list of core skills detected (e.g., ["React", "Go"]).
    3. Missing critical skills based on modern cloud/full-stack standards (e.g., ["Docker", "AWS S3"]).
    4. At least 3 Key Strengths found in their style, experience or formatting.
    5. At least 3 Key Weaknesses or vulnerabilities in their content.
    6. At least 3 detailed, constructive, actionable suggestions to land dream job interviews.
    
    You must output strictly JSON matching this structure and NO extra text:
    {
      "atsScore": number,
      "skillsDetected": ["string"],
      "missingSkills": ["string"],
      "strengths": ["string"],
      "weaknesses": ["string"],
      "suggestions": ["string"]
    }`;
    
    contents.push({ text: prompt });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER, description: "Candidate overall ATS score, 0 to 100." },
            skillsDetected: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific skills found in resume." },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "In-demand skills that are missing." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Core strengths of the candidate." },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Points of weakness or areas layout could improve." },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable concrete improvements." },
          },
          required: ["atsScore", "skillsDetected", "missingSkills", "strengths", "weaknesses", "suggestions"]
        }
      }
    });
    
    const jsonStr = response.text?.trim() || "{}";
    const result = JSON.parse(jsonStr);
    
    const newAnalysis: ResumeAnalysis = {
      id: 'res-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      fileName: fileName || 'Uploaded_Resume.pdf',
      atsScore: result.atsScore || 70,
      skillsDetected: result.skillsDetected || [],
      missingSkills: result.missingSkills || [],
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      suggestions: result.suggestions || [],
      parsedContent: rawText || `Base64 PDF: ${fileName}`,
      createdAt: new Date().toISOString()
    };
    
    db.resumes.push(newAnalysis);
    
    db.auditLogs.push({
      timestamp: new Date().toISOString(),
      action: 'Resume Analyzed',
      details: `Filename: ${fileName || 'Uploaded text'}, Score: ${result.atsScore}`
    });
    
    res.json(newAnalysis);
  } catch (error: any) {
    console.error('Gemini Resume Analysis Error:', error);
    res.status(500).json({ error: 'AI processing failed: ' + error.message });
  }
});

app.get('/api/resume/history', (req, res) => {
  const user = getCurrentUser(req);
  const userResumes = db.resumes.filter(r => r.userId === user.id);
  res.json(userResumes);
});

// Skill Gap Analysis
app.post('/api/skills/gap-analysis', async (req, res) => {
  const user = getCurrentUser(req);
  const { targetRole, currentSkills } = req.body;
  if (!targetRole) {
    return res.status(400).json({ error: 'Target role is required.' });
  }
  
  const skillList = currentSkills || [];
  
  try {
    const prompt = `Compare current user skills [${skillList.join(', ')}] with the industry standard requirements for a modern "${targetRole}".
    Identify specific gaps, prioritize learnings, and return JSON structure.
    Output schema demands:
    {
      "marketDemand": "High" | "Medium" | "Low",
      "missingSkills": ["string"],
      "learningPriority": [
        {
          "skill": "string",
          "priority": "High" | "Medium" | "Low",
          "reason": "string"
        }
      ]
    }`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketDemand: { type: Type.STRING, description: "Market overall hiring volumes: High, Medium, or Low" },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Missing critical gaps." },
            learningPriority: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  priority: { type: Type.STRING, description: "High, Medium, or Low" },
                  reason: { type: Type.STRING, description: "Justification for immediate priority order." }
                },
                required: ["skill", "priority", "reason"]
              }
            }
          },
          required: ["marketDemand", "missingSkills", "learningPriority"]
        }
      }
    });
    
    const jsonStr = response.text?.trim() || "{}";
    const result = JSON.parse(jsonStr);
    
    const newGap: GapAnalysis = {
      id: 'gap-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      targetRole,
      currentSkills: skillList,
      missingSkills: result.missingSkills || [],
      marketDemand: result.marketDemand || 'High',
      learningPriority: result.learningPriority || [],
      createdAt: new Date().toISOString()
    };
    
    db.gapAnalyses.push(newGap);
    res.json(newGap);
  } catch (error: any) {
    console.error('Gemini Skill Gap Analysis Error:', error);
    res.status(500).json({ error: 'AI Gap Analysis failed: ' + error.message });
  }
});

app.get('/api/skills/history', (req, res) => {
  const user = getCurrentUser(req);
  const analyses = db.gapAnalyses.filter(g => g.userId === user.id);
  res.json(analyses);
});

// Roadmap Generator 3/6/12 Months
app.post('/api/roadmaps/generate', async (req, res) => {
  const user = getCurrentUser(req);
  const { targetRole, timeframeMonths, currentSkills, missingSkills } = req.body;
  
  if (!targetRole) {
    return res.status(400).json({ error: 'Target role is required.' });
  }
  
  const monthsCount = timeframeMonths || 3;
  const current = currentSkills || [];
  const missing = missingSkills || ['AWS', 'Docker', 'Testing', 'Modern UI Design'];
  
  try {
    const prompt = `Act as an elite tech mentor. Generate a detailed, chronological learning roadmap for a student aiming to land a "${targetRole}" job in exactly ${monthsCount} months.
    Current skills: [${current.join(', ')}]
    Skills to learn: [${missing.join(', ')}]
    
    Generate exactly ${monthsCount} chronological months of learning. For each month, provide weekly focus, and at least 2 highly practical, realistic courses, portfolio projects, certifications, or practice milestones.
    Structure the response in exact JSON mapping the typescript schema:
    {
      "focusArea": "string summary",
      "months": [
        {
          "monthNumber": number,
          "focus": "string monthly focus summary",
          "weeks": [
            {
              "weekNumber": number, // chronological, start from 1 to 4 for each month
              "focus": "string weekly theme focus",
              "tasks": [
                {
                  "title": "string actionable title",
                  "description": "string clear brief context",
                  "type": "course" | "project" | "certification" | "practice"
                }
              ]
            }
          ]
        }
      ]
    }`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusArea: { type: Type.STRING },
            months: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  monthNumber: { type: Type.INTEGER },
                  focus: { type: Type.STRING },
                  weeks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        weekNumber: { type: Type.INTEGER },
                        focus: { type: Type.STRING },
                        tasks: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              title: { type: Type.STRING },
                              description: { type: Type.STRING },
                              type: { type: Type.STRING, description: "One of: course, project, certification, practice" }
                            },
                            required: ["title", "description", "type"]
                          }
                        }
                      },
                      required: ["weekNumber", "focus", "tasks"]
                    }
                  }
                },
                required: ["monthNumber", "focus", "weeks"]
              }
            }
          },
          required: ["focusArea", "months"]
        }
      }
    });
    
    const jsonStr = response.text?.trim() || "{}";
    const data = JSON.parse(jsonStr);
    
    // Supplement tasks with completed and randomized IDs
    let currentTaskCount = 0;
    const monthsWithState = (data.months || []).map((m: any) => ({
      ...m,
      weeks: (m.weeks || []).map((w: any) => ({
        ...w,
        tasks: (w.tasks || []).map((t: any) => {
          currentTaskCount++;
          return {
            id: `task-${currentTaskCount}-${Math.random().toString(36).substr(2, 4)}`,
            ...t,
            completed: false
          };
        })
      }))
    }));
    
    const newRoadmap: CareerRoadmap = {
      id: 'road-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      targetRole,
      timeframeMonths: monthsCount,
      focusArea: data.focusArea || `Chronological focus roadmap for ${targetRole}`,
      months: monthsWithState,
      createdAt: new Date().toISOString()
    };
    
    db.roadmaps.push(newRoadmap);
    res.json(newRoadmap);
  } catch (error: any) {
    console.error('Gemini Roadmap Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap: ' + error.message });
  }
});

app.get('/api/roadmaps/history', (req, res) => {
  const user = getCurrentUser(req);
  res.json(db.roadmaps.filter(r => r.userId === user.id));
});

// Mock Interview System
const INTERVIEW_QUESTIONS: any[] = [
  { id: 'q1', text: 'Tell me about yourself and your primary programming frameworks.', category: 'HR', difficulty: 'Beginner' },
  { id: 'q2', text: 'Why do you want to join a startup instead of an established corporate giant?', category: 'HR', difficulty: 'Beginner' },
  { id: 'q3', text: 'How do you handle difficult feedback from a tech lead on draft pull requests?', category: 'HR', difficulty: 'Intermediate' },
  { id: 'q4', text: 'Explain CORS and how cookies participate in browser cross-origin limits.', category: 'Technical', difficulty: 'Intermediate' },
  { id: 'q5', text: 'What is the performance implication of React 19 State transitions and useTransition?', category: 'Technical', difficulty: 'Advanced' },
  { id: 'q6', text: 'How do you structure indexes to prevent table scans in high-write PostgreSQL pipelines?', category: 'Technical', difficulty: 'Advanced' },
  { id: 'q7', text: 'Design an asset CDN routing scheme that limits cache misses for globally distributed video objects.', category: 'System Design', difficulty: 'Advanced' },
  { id: 'q8', text: 'Scale a highly modular in-memory leaderboard pipeline to survive socket disconnections.', category: 'System Design', difficulty: 'Advanced' },
  { id: 'q9', text: 'Tell me about a time you solved an ambiguous bug that had no log traces.', category: 'Behavioral', difficulty: 'Intermediate' }
];

app.post('/api/interviews/start', (req, res) => {
  const { category, difficulty } = req.body;
  const filtered = INTERVIEW_QUESTIONS.filter(q => q.category === category && q.difficulty === difficulty);
  const questions = filtered.length > 0 ? filtered : INTERVIEW_QUESTIONS.filter(q => q.category === category);
  const activeQuestion = questions[Math.floor(Math.random() * questions.length)] || INTERVIEW_QUESTIONS[0];
  
  res.json({
    sessionId: 'session-' + Math.random().toString(36).substr(2, 9),
    firstQuestion: activeQuestion
  });
});

app.post('/api/interviews/evaluate', async (req, res) => {
  const user = getCurrentUser(req);
  const { category, difficulty, questionText, userAnswer } = req.body;
  
  if (!questionText || !userAnswer) {
    return res.status(400).json({ error: 'Question and User Answer are required.' });
  }
  
  try {
    const prompt = `You are a Principal Software Architect and elite Hiring Manager. Evaluate this single candidate answer to the interview question.
    Category: ${category}
    Difficulty: ${difficulty}
    Question: "${questionText}"
    Candidate's Answer: "${userAnswer}"
    
    Assess details accurately:
    1. Score: 0 to 100 rating based on factual completeness and communication clarity.
    2. Feedback: Precise commentary explaining what they did well/wrong.
    3. Suggestions: Direct actionable examples of a stellar response.
    
    You must output strictly JSON in this schema:
    {
      "score": number,
      "feedback": "string comments",
      "suggestions": "string how to formulate the response best"
    }`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Evaluation score 0-100" },
            feedback: { type: Type.STRING },
            suggestions: { type: Type.STRING }
          },
          required: ["score", "feedback", "suggestions"]
        }
      }
    });
    
    const jsonStr = response.text?.trim() || "{}";
    const evalResult = JSON.parse(jsonStr);
    
    // Select a follow up question
    const remaining = INTERVIEW_QUESTIONS.filter(q => q.category === category && q.text !== questionText);
    const nextQuestion = remaining[Math.floor(Math.random() * remaining.length)] || INTERVIEW_QUESTIONS[0];
    
    res.json({
      evaluation: evalResult,
      nextQuestion: nextQuestion
    });
  } catch (error: any) {
    console.error('Gemini Interview Evaluation Error:', error);
    res.status(500).json({ error: 'Failed to evaluate response: ' + error.message });
  }
});

app.post('/api/interviews/save', (req, res) => {
  const user = getCurrentUser(req);
  const { category, difficulty, score, accuracy, confidence, communicationRating, suggestions, exchanges } = req.body;
  
  const savedSession: MockInterviewSession = {
    id: 'int-' + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    category: category || 'Technical',
    difficulty: difficulty || 'Intermediate',
    score: score || 80,
    accuracy: accuracy || 80,
    confidence: confidence || 80,
    communicationRating: communicationRating || 80,
    suggestions: suggestions || [],
    exchanges: exchanges || [],
    createdAt: new Date().toISOString()
  };
  
  db.interviews.push(savedSession);
  
  db.auditLogs.push({
    timestamp: new Date().toISOString(),
    action: 'Mock Interview Completed',
    details: `User: ${user.email}, Category: ${category}, Performance: ${score}/100`
  });
  
  res.json(savedSession);
});

app.get('/api/interviews/history', (req, res) => {
  const user = getCurrentUser(req);
  res.json(db.interviews.filter(i => i.userId === user.id));
});

// AI Project Recommender
app.post('/api/projects/recommend', async (req, res) => {
  const user = getCurrentUser(req);
  const { targetRole, currentSkills } = req.body;
  
  if (!targetRole) {
    return res.status(400).json({ error: 'Target role is required.' });
  }
  
  const skills = currentSkills || ['React', 'Node.js'];
  
  try {
    const prompt = `Recommend exactly 3 highly distinctive, full-stack portfolio projects for a developer of target role "${targetRole}".
    They currently know: [${skills.join(', ')}]
    
    Generate projects for three difficulty tiers: 
    1. Beginner (simple functional utility)
    2. Intermediate (polished cloud module)
    3. Advanced / Startup-Level (complex scalable microservices, edge queues, or specialized databases integration).
    
    Format the output strictly as a JSON list matching the schema:
    [
      {
        "title": "string title",
        "difficulty": "Beginner" | "Intermediate" | "Advanced" | "Startup",
        "description": "string summary",
        "techStack": ["string"],
        "architecture": ["string core architectural layers"],
        "timeline": "string duration estimation",
        "resumeValue": "string high-leverage description for a resume line"
      }
    ]`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              difficulty: { type: Type.STRING, description: "Beginner, Intermediate, Advanced, or Startup" },
              description: { type: Type.STRING },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              architecture: { type: Type.ARRAY, items: { type: Type.STRING } },
              timeline: { type: Type.STRING },
              resumeValue: { type: Type.STRING }
            },
            required: ["title", "difficulty", "description", "techStack", "architecture", "timeline", "resumeValue"]
          }
        }
      }
    });
    
    const jsonStr = response.text?.trim() || "[]";
    const recommended = JSON.parse(jsonStr);
    
    const marked = recommended.map((r: any) => ({
      id: 'proj-' + Math.random().toString(36).substr(2, 9),
      ...r,
      createdAt: new Date().toISOString()
    }));
    
    res.json(marked);
  } catch (error: any) {
    console.error('Gemini Project Recommendation Error:', error);
    res.status(500).json({ error: 'Failed to recommend projects: ' + error.message });
  }
});

// 8. Admin Panel Insights
app.get('/api/admin/stats', (req, res) => {
  const user = getCurrentUser(req);
  if (user.role !== 'admin' && user.email !== 'charan21003@gmail.com') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  
  const stats: PlatformStat = {
    totalUsers: db.users.length,
    proUsers: db.users.filter(u => u.subscription !== 'free').length,
    totalResumesAnalyzed: db.resumes.length,
    totalInterviewsCompleted: db.interviews.length,
    aiTokensUsed: Math.floor(Math.random() * 20000) + 150000 // Mock AI consumption tracker
  };
  
  res.json({
    stats,
    users: db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, subscription: u.subscription, createdAt: u.createdAt })),
    auditLogs: db.auditLogs,
    reports: db.reports
  });
});

app.post('/api/admin/moderate-report', (req, res) => {
  const { reportId, status } = req.body;
  db.auditLogs.push({
    timestamp: new Date().toISOString(),
    action: 'Report Moderated',
    details: `Id: ${reportId}, Status updated to: ${status}`
  });
  res.json({ success: true });
});

// 9. AI Career Coach Live Endpoint
app.post('/api/chat', async (req, res) => {
  const user = getCurrentUser(req);
  const { messages, currentSkills, targetRole } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const chatHistory = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'AI Coach'}: ${m.content}`).join('\n');
    
    const contextPrompt = `You are a world-class Principal engineering career mentor and advisor. Your name is 'Coach Pilot'.
    The candidate you are speaking with is named ${user.name} with email ${user.email}.
    Their target role is: "${targetRole || 'Software Engineer Intern'}".
    Their current detected skills are: [${(currentSkills || []).join(', ')}].

    Maintain an incredibly encouraging, smart, objective, and recruiter-focused perspective. Give modular, actionable tips. Avoid overly wordy descriptions.
    
    Here is the chat history:
    ${chatHistory}
    
    Respond as the AI Coach with your next response (do not output "AI Coach:" prefix, just give the response message):`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contextPrompt,
    });

    const reply = response.text || "I apologize, I experienced a minor network interruption. How can I help you accelerate your resume scoring or interview practice goals today?";
    
    res.json({ reply: reply.trim() });
  } catch (error: any) {
    console.error('Gemini Chat Coach Error:', error);
    res.status(500).json({ error: 'AI Coach was unable to process message: ' + error.message });
  }
});

// Serve static assets / handle Vite middleware in developmental / production modes
async function bootstrapServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development Mode Integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    // Mount Vite middlewares
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for developer live iteration.');
  } else {
    // Production Mode serving compiled bundles
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static bundles host initialized.');
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerPilot AI Server spinning smoothly on port ${PORT}`);
  });
}

bootstrapServer();
