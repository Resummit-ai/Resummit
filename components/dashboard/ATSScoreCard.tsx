"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, RefreshCw, AlertTriangle, Check, Zap, ChevronRight } from "lucide-react";
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
  resumeName?: string;
  versionName?: string;
}

const SIGNAL_LABELS: Record<string, string> = {
  SHORT_SUMMARY:      "SUMMARY TOO SHORT",
  REPETITIVE_VERBS:   "REPETITIVE ACTION VERBS",
  LOW_SKILL_DENSITY:  "LOW SKILL DENSITY",
  NO_IMPACT_BULLETS:  "NO MEASURABLE IMPACT",
};

function ScoreRing({ score, size = 84 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#32704F" : score >= 65 ? "#5473D1" : "#F59E0B";

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="currentColor" strokeWidth="6"
        fill="none" className="text-[#E1E5EB] dark:text-neutral-800"
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

export function ATSScoreCard({ storedScore, versionId, resumeName, versionName }: ATSScoreCardProps) {
  const [result, setResult]     = useState<ATSResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const displayScore = result?.score ?? (storedScore > 0 ? storedScore : 55);
  const scoreLabel   = displayScore >= 85 ? "Market-Ready" : displayScore >= 65 ? "Optimizing" : "Needs Work";
  const scoreDesc    = displayScore >= 85
    ? "Your resume is fully optimized for top-tier ATS screening."
    : displayScore >= 65
    ? "Your resume is competitive with strong technical points."
    : "Your resume has good content, but needs improvement in a few key areas.";

  const breakdown = result?.breakdown ?? {
    skills: 90,
    projects: 40,
    impact: 30,
    overall: displayScore,
  };

  const weakSignals = result?.weakSignals?.length ? result.weakSignals : ["REPETITIVE_VERBS"];
  const quickFixes = result?.quickFixes?.length
    ? result.quickFixes
    : [
        "Add specific numbers, percentages, or metrics to show impact.",
        "Use a wider range of action verbs and provide unique project details."
      ];

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
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-white/95 dark:bg-[#141417]/95 backdrop-blur-md border border-white/60 dark:border-white/10 relative overflow-hidden transition-all shadow-2xl text-[#171717] dark:text-[#f2efe9]">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center">
                <Target className="w-3 h-3 text-blue-600 dark:text-[#0099ff]" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Resume ATS Score
              </h3>
            </div>
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-700 dark:text-[#0099ff] border border-blue-500/20 rounded-full text-[10px] font-bold tracking-wide">
              {resumeName || "My Professional Resume"}{versionName ? ` (${versionName})` : ' (Main)'}
            </span>
          </div>
          <button
            onClick={fetchScore}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-[#0099ff] border border-neutral-200 dark:border-neutral-700 transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Scoring…" : "Refresh"}
          </button>
        </div>

        {/* Score display */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
          {/* Ring */}
          <div className="relative flex-shrink-0 self-center sm:self-auto">
            <ScoreRing score={displayScore} size={88} />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayScore}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-black leading-none text-neutral-950 dark:text-white"
                >
                  {displayScore}
                </motion.span>
              </AnimatePresence>
              <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider mt-0.5">
                /100
              </span>
            </div>
          </div>

          {/* Label + breakdown */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-neutral-950 dark:text-white mb-0.5">
              {loading && !result ? "Analyzing…" : scoreLabel}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
              {scoreDesc}
            </p>

            <div className="space-y-2">
              {[
                { label: "SKILLS",   value: breakdown.skills },
                { label: "PROJECTS", value: breakdown.projects },
                { label: "IMPACT",   value: breakdown.impact },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-wider text-neutral-500 dark:text-neutral-400 w-16 flex-shrink-0">
                    {label}
                  </span>
                  <div className="flex-1 h-2 bg-neutral-200/70 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600 dark:bg-[#0099ff] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-900 dark:text-neutral-100 w-12 text-right">
                    {value}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">{error}</p>
          </div>
        )}

        {/* Weak signals / Flags detected */}
        {weakSignals.length > 0 && (
          <div className="space-y-2 mb-5 pt-2 border-t border-neutral-200/80 dark:border-neutral-800">
            <p className="text-[11px] font-bold tracking-wider text-neutral-600 dark:text-neutral-400">
              Flags detected
            </p>
            <div className="flex flex-wrap gap-2">
              {weakSignals.map((sig) => (
                <span
                  key={sig}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                >
                  {SIGNAL_LABELS[sig] ?? sig}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick wins / Recommended Actions */}
        {quickFixes.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-[#0099ff]">
              <Target className="w-3.5 h-3.5" />
              <p className="text-xs font-bold tracking-wider text-neutral-900 dark:text-white">
                Recommended Actions
              </p>
            </div>
            <div className="space-y-1.5 pl-0.5">
              {quickFixes.slice(0, 2).map((fix, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-[#0099ff] flex-shrink-0 mt-0.5 stroke-[2.5]" />
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Link to Resume Editor */}
        <div className="pt-3.5 mt-4 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Apply recommendations
          </span>
          <Link
            href="/editor"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-[#0099ff] hover:underline"
          >
            <span>Open Resume Editor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
