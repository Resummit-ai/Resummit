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
      
      // Final log
      setSynthesisLogs(prev => [...prev, "Identity synthesis complete."]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsSynthesizing(false);
      setStep("setup"); // Switch back to manual setup if auto-synthesis fails
    }
  };

  return (
    <div className="fixed inset-0 z-[100] dark-page bg-neutral-950 flex items-center justify-center overflow-y-auto py-12 font-outfit select-none">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

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
            <div className="text-center mb-10 animate-fade-in">
              {/* Resummit Brand Logo & Wordmark */}
              <div className="flex justify-center mb-8 animate-fade-in">
                <div className="logo scale-95 select-none">
                  <svg viewBox="0 0 32 32" className="logo-icon-svg !w-8 !h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z" className="logo-doc-body" />
                    <path d="M19 3V9H25L19 3Z" className="logo-doc-fold" />
                    <path d="M11 13H17M11 17H21M11 21H18M11 25H20" className="logo-doc-lines" strokeWidth="2" strokeLinecap="round" />
                    <path d="M20 8.5L25 3.5" className="logo-flag-pole" strokeWidth="2" strokeLinecap="round" />
                    <path d="M25 3.5L27 6.5L23.5 5.5Z" className="logo-flag-banner" />
                  </svg>
                  <div className="logo-text-group">
                    <div className="logo-wordmark !text-lg text-white font-bold">RESUMMIT</div>
                    <div className="logo-tagline !text-[0.52rem] text-neutral-500">YOUR COMMITS. YOUR CAREER.</div>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">
                Setup your Resummit Profile
              </h1>
              <p className="text-neutral-400 text-sm font-light">
                We've connected your account. Fill in your professional details to initiate analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Identity Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-md">
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    Identity Sources
                  </h3>

                  <div className="space-y-5">
                    {/* GitHub Username input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500 block">GitHub Profile</label>
                      <div className="group relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                          <GitBranch className="w-5 h-5" />
                        </div>
                        <input
                          required
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="github_username"
                          className="w-full bg-neutral-950 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-neutral-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* LinkedIn input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500 block">LinkedIn Profile (Optional)</label>
                      <div className="group relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                          <LinkIcon className="w-5 h-5" />
                        </div>
                        <input
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-neutral-950 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-neutral-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Focus Areas */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-md">
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Career Specialization
                  </h3>

                  <div className="space-y-6">
                    {/* Domain Grid */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500 mb-3 block">Target Domain</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {DOMAINS.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setRole(d.label)}
                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-[100px] cursor-pointer ${
                              role === d.label 
                                ? "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/5 text-blue-400 font-bold" 
                                : "bg-neutral-950 border border-white/5 text-neutral-400 hover:border-white/10 hover:text-white"
                            }`}
                          >
                            <d.icon className={`w-5 h-5 ${role === d.label ? "text-blue-450" : d.color}`} />
                            <span className={`text-xs font-bold block mt-2 ${role === d.label ? "text-blue-400" : "text-white"}`}>{d.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Experience Level Grid */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500 mb-3 block">Seniority</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {EXPERIENCE_LEVELS.map((level) => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => setExp(level.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                              exp === level.id 
                                ? "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/5 text-blue-400 font-bold" 
                                : "bg-neutral-950 border border-white/5 text-neutral-400 hover:border-white/10 hover:text-white"
                            }`}
                          >
                            <span className={`text-xs font-bold block mb-1 ${exp === level.id ? "text-blue-400" : "text-white"}`}>{level.label}</span>
                            <span className={`text-[9px] uppercase tracking-widest ${exp === level.id ? "text-blue-500/70" : "text-neutral-500"}`}>{level.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-8 text-center">
              <button
                type="button"
                disabled={!github || !role || !exp}
                onClick={() => startSynthesis()}
                className="group w-full max-w-md py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-50 disabled:from-neutral-700 disabled:to-neutral-800 disabled:text-neutral-500 rounded-2xl font-bold text-base transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] inline-flex items-center justify-center gap-3 border border-blue-400/20 cursor-pointer"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl px-6 text-center z-10"
          >
            <div className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-xl backdrop-blur-md">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
                <div className="relative w-32 h-32 bg-neutral-950 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
                   <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-8 text-white">Synthesizing Profile</h2>
              
              <div className="space-y-4 max-w-md mx-auto h-[240px] flex flex-col justify-end overflow-hidden border-t border-white/5 pt-6">
                 <AnimatePresence initial={false}>
                    {synthesisLogs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 text-left"
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${i === synthesisLogs.length - 1 ? 'text-blue-500' : 'text-emerald-500'}`} />
                        <span className={`text-sm font-medium ${i === synthesisLogs.length - 1 ? 'text-white' : 'text-neutral-550'}`}>
                          {log}
                        </span>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
