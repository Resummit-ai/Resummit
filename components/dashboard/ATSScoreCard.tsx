"use client";

import { useEffect, useState } from "react";
import { Target, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ATSResult {
  score: number;
  breakdown: { skills: number; projects: number; impact: number; overall: number };
  weakSignals: string[];
  topIssues: string[];
  quickFixes: string[];
  error?: string;
}

interface ATSScoreCardProps {
  storedScore: number;      // Score from DB (shown instantly)
  versionId?: string;       // Resume version to score
}

const SIGNAL_LABELS: Record<string, string> = {
  SHORT_SUMMARY:      "Summary too short",
  REPETITIVE_VERBS:   "Repetitive action verbs",
  LOW_SKILL_DENSITY:  "Low skill density",
  NO_IMPACT_BULLETS:  "No measurable impact",
};

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#22c55e" : score >= 65 ? "#3b82f6" : "#f59e0b";

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="currentColor" strokeWidth="6"
        fill="none" className="text-white/5"
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth="6"
        fill="none" strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: progress }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

export function ATSScoreCard({ storedScore, versionId }: ATSScoreCardProps) {
  const [result, setResult]     = useState<ATSResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const displayScore = result?.score ?? storedScore;
  const scoreLabel   = displayScore >= 85 ? "Market-Ready" : displayScore >= 65 ? "Optimizing" : "Needs Work";
  const scoreColor   = displayScore >= 85 ? "text-emerald-400" : displayScore >= 65 ? "text-blue-400" : "text-amber-400";

  async function fetchScore() {
    setLoading(true);
    setError(null);
    try {
      const url = versionId
        ? `/api/cv/ats-score?versionId=${versionId}`
        : `/api/cv/ats-score`;
      const res = await fetch(url);
      if (res.status === 429) {
        setError("Rate limited — try again in a few minutes");
        return;
      }
      const data: ATSResult = await res.json();
      if (data.error && !data.score) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to connect to scoring service");
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }

  // Auto-fetch on mount
  useEffect(() => {
    fetchScore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] relative overflow-hidden group transition-all duration-200">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-all duration-700" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <h3 className="text-[10px] font-black text-[var(--sclade-text-secondary)] uppercase tracking-[0.2em]">
              Resume ATS Score
            </h3>
          </div>
          <button
            onClick={fetchScore}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/5 dark:hover:bg-white/5 border border-black/5 dark:border-white/5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Scoring…" : "Refresh"}
          </button>
        </div>

        {/* Score display */}
        <div className="flex items-center gap-8 mb-6">
          {/* Ring */}
          <div className="relative flex-shrink-0">
            <ScoreRing score={displayScore} size={88} />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayScore}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-bold leading-none"
                >
                  {loading && !result ? "—" : displayScore}
                </motion.span>
              </AnimatePresence>
              <span className="text-[8px] font-bold text-[var(--sclade-text-muted)] uppercase tracking-widest mt-0.5">
                /100
              </span>
            </div>
          </div>

          {/* Label + breakdown */}
          <div className="flex-1 min-w-0">
            <div className={`text-xl font-bold mb-1 ${scoreColor}`}>
              {loading && !result ? (
                <span className="text-[var(--sclade-text-muted)]">Analyzing…</span>
              ) : scoreLabel}
            </div>

            {result && (
              <div className="space-y-1.5 mt-3">
                {[
                  { label: "Skills",   value: result.breakdown.skills },
                  { label: "Projects", value: result.breakdown.projects },
                  { label: "Impact",   value: result.breakdown.impact },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--sclade-text-muted)] w-14 flex-shrink-0">
                      {label}
                    </span>
                    <div className="flex-1 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-[var(--sclade-text-secondary)] w-6 text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <p className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">{error}</p>
          </div>
        )}

        {/* Weak signals */}
        {result && result.weakSignals.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--sclade-text-muted)]">
              Flags Detected
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.weakSignals.map((sig) => (
                <span
                  key={sig}
                  className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                >
                  {SIGNAL_LABELS[sig] ?? sig}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick fixes */}
        {result && result.quickFixes.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--sclade-text-muted)]">
              Quick Wins
            </p>
            <div className="space-y-1.5">
              {result.quickFixes.slice(0, 2).map((fix, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Zap className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[var(--sclade-text-secondary)] leading-relaxed">{fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success state: no issues */}
        {result && result.weakSignals.length === 0 && result.score >= 85 && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
              Resume is ATS-optimized. Ready for applications.
            </p>
          </div>
        )}

        {/* Stale score notice */}
        {!hasLoaded && !loading && (
          <p className="text-[9px] text-[var(--sclade-text-muted)] mt-3">
            Showing cached score. Click Refresh for live analysis.
          </p>
        )}
      </div>
    </div>
  );
}
