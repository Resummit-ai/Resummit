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

type Step = "welcome" | "sources" | "role" | "synthesis";

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
  const [step, setStep] = useState<Step>("welcome");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisLogs, setSynthesisLogs] = useState<string[]>([]);
  const router = useRouter();

  const handleStart = () => setStep("sources");

  const handleSourcesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("role");
  };

  const startSynthesis = async () => {
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
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
    }

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github, linkedin, role, exp }),
      });
      
      if (!res.ok) throw new Error("Synthesis failed");
      
      // Final log
      setSynthesisLogs(prev => [...prev, "Identity synthesis complete."]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center overflow-hidden font-outfit">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/5 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl text-center px-6"
          >
            <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-500/10 transform rotate-3">
              <Rocket className="text-blue-500 w-12 h-12" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
              SCLADE<span className="text-blue-500">OS</span>
            </h1>
            <p className="text-neutral-400 text-xl md:text-2xl mb-12 font-light leading-relaxed">
              The first AI system that understands your <br /> 
              <span className="text-white font-medium italic">engineering DNA</span> automatically.
            </p>
            <button
              onClick={handleStart}
              className="group inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[2rem] font-bold text-lg hover:bg-neutral-200 transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              Begin Initialization
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === "sources" && (
          <motion.div
            key="sources"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-xl px-6"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-neutral-900 border border-white/5 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <h2 className="text-2xl font-bold">Identity Sources</h2>
            </div>
            
            <form onSubmit={handleSourcesSubmit} className="space-y-6">
              <div className="group relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                  <GitBranch className="w-6 h-6" />
                </div>
                <input
                  required
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="GitHub Username"
                  className="w-full bg-neutral-900/50 border border-white/5 focus:border-blue-500/50 rounded-[1.5rem] py-6 pl-14 pr-6 text-lg text-white outline-none transition-all placeholder:text-neutral-600"
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                  <LinkIcon className="w-6 h-6" />
                </div>
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn URL (Optional)"
                  className="w-full bg-neutral-900/50 border border-white/5 focus:border-blue-500/50 rounded-[1.5rem] py-6 pl-14 pr-6 text-lg text-white outline-none transition-all placeholder:text-neutral-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-bold text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {step === "role" && (
          <motion.div
            key="role"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-2xl px-6"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-neutral-900 border border-white/5 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-neutral-400" />
              </div>
              <h2 className="text-2xl font-bold">Career Intent</h2>
            </div>

            <div className="mb-8">
              <label className="text-[10px] font-black uppercase tracking-[3px] text-neutral-500 mb-4 block">Target Domain</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setRole(d.label)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      role === d.label 
                        ? "bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10" 
                        : "bg-neutral-900/50 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <d.icon className={`w-6 h-6 mb-3 ${d.color}`} />
                    <span className="text-sm font-bold block">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <label className="text-[10px] font-black uppercase tracking-[3px] text-neutral-500 mb-4 block">Experience Level</label>
              <div className="grid grid-cols-2 gap-3">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setExp(level.id)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      exp === level.id 
                        ? "bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10" 
                        : "bg-neutral-900/50 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className="text-sm font-bold block mb-1">{level.label}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{level.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!role || !exp}
              onClick={startSynthesis}
              className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-[1.5rem] font-bold text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Start Identity Synthesis
              <Zap className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === "synthesis" && (
          <motion.div
            key="synthesis"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl px-6 text-center"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
              <div className="relative w-32 h-32 bg-neutral-900 border border-blue-500/30 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
                 <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-8 font-outfit">Synthesizing Profile</h2>
            
            <div className="space-y-4 max-w-md mx-auto h-[240px] flex flex-col justify-end overflow-hidden">
               <AnimatePresence initial={false}>
                  {synthesisLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 text-left"
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${i === synthesisLogs.length - 1 ? 'text-blue-500' : 'text-emerald-500'}`} />
                      <span className={`text-sm font-medium ${i === synthesisLogs.length - 1 ? 'text-white' : 'text-neutral-500'}`}>
                        {log}
                      </span>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
