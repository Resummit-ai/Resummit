"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  GitBranch, 
  Link as LinkIcon, 
  ArrowRight, 
  Sparkles, 
  Search, 
  Cpu, 
  Database, 
  Layout, 
  Shield, 
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Step = "setup" | "synthesis";

const DOMAINS = [
  { id: "frontend", label: "Frontend", icon: Layout, color: "text-blue-400" },
  { id: "backend", label: "Backend", icon: Database, color: "text-emerald-400" },
  { id: "fullstack", label: "Fullstack", icon: Cpu, color: "text-violet-400" },
  { id: "ai", label: "AI / ML", icon: Sparkles, color: "text-amber-400" },
  { id: "devops", label: "DevOps", icon: Zap, color: "text-orange-400" },
  { id: "cyber", label: "Cybersecurity", icon: Shield, color: "text-red-400" },
];

const EXPERIENCE_LEVELS = [
  { id: "ENTRY", label: "Entry Level", desc: "0-2 years" },
  { id: "MID", label: "Mid Level", desc: "3-5 years" },
  { id: "SENIOR", label: "Senior", desc: "6-10 years" },
  { id: "LEAD", label: "Lead / Staff", desc: "10+ years" },
];

export function Onboarding() {
  const [step, setStep] = useState<Step>("setup");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [exp, setExp] = useState("MID");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisLogs, setSynthesisLogs] = useState<string[]>([]);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [needsManualProjects, setNeedsManualProjects] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user && !hasTriggered) {
      setHasTriggered(true);
      const resolvedGithub = (session.user as any).githubUsername || "";
      setGithub(resolvedGithub);
    }
  }, [session, hasTriggered]);

  const startSynthesis = async (
    targetGithub?: string,
    targetRole?: string,
    targetExp?: string
  ) => {
    const activeGithub = targetGithub !== undefined ? targetGithub : github;
    const activeRole = targetRole !== undefined ? targetRole : role;
    const activeExp = targetExp !== undefined ? targetExp : exp;

    setStep("synthesis");
    setIsSynthesizing(true);
    
    const logs = [
      "Connecting to GitHub Graph API...",
      "Analyzing repository commit density...",
      "Extracting engineering signals from source...",
      "Detecting production deployment patterns...",
      "Mapping technology substrate...",
      "Synthesizing professional identity...",
      "Optimizing for recruiter scan flow...",
      "Generating ATS-optimized CV structure..."
    ];

    for (let i = 0; i < logs.length; i++) {
      setSynthesisLogs(prev => [...prev, logs[i]]);
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 600));
    }

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          github: activeGithub, 
          linkedin: linkedin || "", 
          role: activeRole, 
          exp: activeExp 
        }),
      });
      
      if (!res.ok) throw new Error("Synthesis failed");
      const data = await res.json().catch(() => ({}));
      
      if (data?.needsManualProjects) {
        setNeedsManualProjects(true);
        setSynthesisLogs(prev => [...prev, "We couldn't find public repos. Add a project manually, or connect GitHub."]);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        // Final log
        setSynthesisLogs(prev => [...prev, "Identity synthesis complete."]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsSynthesizing(false);
      setStep("setup"); // Switch back to manual setup if auto-synthesis fails
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--sclade-bg)] text-[var(--sclade-text-primary)] flex items-center justify-center overflow-y-auto py-12 font-outfit select-none">
      <AnimatePresence mode="wait">
        {step === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-4xl px-6 my-auto z-10"
          >
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
              {/* Resummit Brand Logo & Wordmark */}
              <div className="flex justify-center mb-6 animate-fade-in">
                <div className="logo scale-95 select-none">
                  <svg viewBox="0 0 32 32" className="logo-icon-svg !w-8 !h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z" className="logo-doc-body" />
                    <path d="M19 3V9H25L19 3Z" className="logo-doc-fold" />
                    <path d="M11 13H17M11 17H21M11 21H18M11 25H20" className="logo-doc-lines" strokeWidth="2" strokeLinecap="round" />
                    <path d="M20 8.5L25 3.5" className="logo-flag-pole" strokeWidth="2" strokeLinecap="round" />
                    <path d="M25 3.5L27 6.5L23.5 5.5Z" className="logo-flag-banner" />
                  </svg>
                  <div className="logo-text-group">
                    <div className="logo-wordmark !text-lg text-[var(--sclade-text-primary)] font-bold">RESUMMIT</div>
                    <div className="logo-tagline !text-[0.52rem] text-[var(--sclade-text-muted)]">YOUR COMMITS. YOUR CAREER.</div>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-[var(--sclade-text-primary)]">
                Setup your Resummit Profile
              </h1>
              <p className="text-[var(--sclade-text-secondary)] text-sm font-normal">
                We've connected your account. Fill in your professional details to initiate analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Identity Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-[var(--sclade-text-primary)] mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--sclade-primary)] animate-ping" />
                    Identity Sources
                  </h3>

                  <div className="space-y-4">
                    {/* GitHub Username input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--sclade-text-secondary)] block">GitHub Profile</label>
                      <div className="group relative">
                        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[var(--sclade-text-muted)] group-focus-within:text-[var(--sclade-primary)] transition-colors">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <input
                          required
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="github_username"
                          className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] focus:border-[var(--sclade-primary)] focus:ring-2 focus:ring-[var(--sclade-primary)]/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[var(--sclade-text-primary)] outline-none transition-all placeholder:text-[var(--sclade-text-muted)] font-mono font-medium"
                        />
                      </div>
                    </div>

                    {/* LinkedIn input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--sclade-text-secondary)] block">LinkedIn Profile (Optional)</label>
                      <div className="group relative">
                        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[var(--sclade-text-muted)] group-focus-within:text-[var(--sclade-primary)] transition-colors">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <input
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] focus:border-[var(--sclade-primary)] focus:ring-2 focus:ring-[var(--sclade-primary)]/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[var(--sclade-text-primary)] outline-none transition-all placeholder:text-[var(--sclade-text-muted)] font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Focus Areas */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-[var(--sclade-text-primary)] mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--sclade-primary)]" />
                    Career Specialization
                  </h3>

                  <div className="space-y-5">
                    {/* Domain Grid */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--sclade-text-secondary)] mb-2.5 block">Target Domain</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {DOMAINS.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setRole(d.label)}
                            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-[86px] cursor-pointer ${
                              role === d.label 
                                ? "bg-[var(--sclade-selected-bg)] border-[var(--sclade-selected-border)] text-[var(--sclade-primary)] font-bold shadow-sm" 
                                : "bg-[var(--sclade-card-bg)] border-[var(--sclade-border)] text-[var(--sclade-text-secondary)] hover:border-[var(--sclade-primary)] hover:bg-[var(--sclade-subtle-bg)]"
                            }`}
                          >
                            <d.icon className={`w-4 h-4 ${role === d.label ? "text-[var(--sclade-primary)]" : "text-[var(--sclade-text-secondary)]"}`} />
                            <span className={`text-xs font-bold block mt-1.5 ${role === d.label ? "text-[var(--sclade-primary)]" : "text-[var(--sclade-text-primary)]"}`}>{d.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Experience Level Grid */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--sclade-text-secondary)] mb-2.5 block">Seniority</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {EXPERIENCE_LEVELS.map((level) => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => setExp(level.id)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              exp === level.id 
                                ? "bg-[var(--sclade-selected-bg)] border-[var(--sclade-selected-border)] text-[var(--sclade-primary)] font-bold shadow-sm" 
                                : "bg-[var(--sclade-card-bg)] border-[var(--sclade-border)] text-[var(--sclade-text-secondary)] hover:border-[var(--sclade-primary)] hover:bg-[var(--sclade-subtle-bg)]"
                            }`}
                          >
                            <span className={`text-xs font-bold block mb-0.5 ${exp === level.id ? "text-[var(--sclade-primary)]" : "text-[var(--sclade-text-primary)]"}`}>{level.label}</span>
                            <span className={`text-[9px] uppercase tracking-wider ${exp === level.id ? "text-[var(--sclade-primary)]" : "text-[var(--sclade-text-muted)]"}`}>{level.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-6 text-center">
              <button
                type="button"
                disabled={!github || !role || !exp}
                onClick={() => startSynthesis()}
                className="group w-full max-w-sm py-3.5 bg-[#5473D1] hover:bg-[#4261C0] text-white disabled:opacity-50 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-sm active:scale-[0.99] inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                Analyze and Generate Resume
                <Zap className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "synthesis" && (
          <motion.div
            key="synthesis"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg px-6 text-center z-10"
          >
            <div className="bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-2xl p-8 shadow-xl">
              <div className="relative mb-8">
                <div className="relative w-24 h-24 bg-[var(--sclade-subtle-bg)] border border-[var(--sclade-border)] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                   <Loader2 className="w-10 h-10 text-[var(--sclade-primary)] animate-spin" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-[var(--sclade-text-primary)]">Synthesizing Profile</h2>
              
              <div className="space-y-3 max-w-sm mx-auto h-[220px] flex flex-col justify-end overflow-hidden border-t border-[var(--sclade-border)] pt-5">
                 <AnimatePresence initial={false}>
                    {synthesisLogs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2.5 text-left"
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${i === synthesisLogs.length - 1 ? 'text-[var(--sclade-primary)]' : 'text-[var(--sclade-success-text,#32704F)]'}`} />
                        <span className={`text-xs font-medium ${i === synthesisLogs.length - 1 ? 'text-[var(--sclade-text-primary)] font-bold' : 'text-[var(--sclade-text-secondary)]'}`}>
                          {log}
                        </span>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              {needsManualProjects && (
                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs text-center font-medium animate-in fade-in">
                  We couldn&apos;t find public repos. Add a project manually, or connect GitHub.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
