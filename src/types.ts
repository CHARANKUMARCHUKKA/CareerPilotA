/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  subscription: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  fileName: string;
  atsScore: number;
  skillsDetected: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  parsedContent: string;
  createdAt: string;
}

export interface GapAnalysis {
  id: string;
  userId: string;
  targetRole: string;
  currentSkills: string[];
  missingSkills: string[];
  marketDemand: 'High' | 'Medium' | 'Low';
  learningPriority: { skill: string; reason: string; priority: 'High' | 'Medium' | 'Low' }[];
  readiness?: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'course' | 'project' | 'certification' | 'practice';
  link?: string;
}

export interface WeekPlan {
  weekNumber: number;
  focus: string;
  tasks: Task[];
}

export interface MonthPlan {
  monthNumber: number;
  focus: string;
  weeks: WeekPlan[];
}

export interface CareerRoadmap {
  id: string;
  userId: string;
  targetRole: string;
  timeframeMonths: number;
  focusArea: string;
  months: MonthPlan[];
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  category: 'HR' | 'Technical' | 'System Design' | 'Behavioral';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface InterviewExchange {
  questionId: string;
  questionText: string;
  userAnswer: string;
  evalScore: number; // 0-100
  feedback: string;
  suggestions: string;
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  category: 'HR' | 'Technical' | 'System Design' | 'Behavioral';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  score: number;
  accuracy: number;
  confidence: number;
  communicationRating: number;
  suggestions: string[];
  exchanges: InterviewExchange[];
  createdAt: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Startup';
  description: string;
  architecture: string[];
  techStack: string[];
  timeline: string;
  resumeValue: string;
  createdAt: string;
}

export interface PlatformStat {
  totalUsers: number;
  proUsers: number;
  totalResumesAnalyzed: number;
  totalInterviewsCompleted: number;
  aiTokensUsed: number;
}
