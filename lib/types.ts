// lib/types.ts — Shared CV data types used across client and server

export interface CVSkills {
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface CVExperience {
  company: string;
  title: string;
  period: string;
  bullets: string[];
}

export interface CVEducation {
  school: string;
  degree: string;
  year: string;
  gpa?: string;
}

export interface CVData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
  targetRole: string;
  skills: CVSkills;
  experience: CVExperience[];
  education: CVEducation[];
  atsScore?: number;
  slug?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  techStack: string;
  bullets: string[];
  repoUrl?: string | null;
  included?: boolean; // UI-only: whether to include in CV/PDF export
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type EditorTab = "profile" | "skills" | "experience" | "projects";
