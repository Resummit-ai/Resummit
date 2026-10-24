"use client";

import React from "react";
import Link from "next/link";
import {
  Target,
  Cpu,
  GitBranch,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface DashboardPixelBannerProps {
  githubUsername?: string | null;
  lastSyncAt?: string | null;
  atsScore?: number;
  repoCount?: number;
  pendingSuggestionsCount?: number;
  stackConfidence?: number;
  strongestDomain?: string;
  topSkills?: string[];
}

export function DashboardPixelBanner({
  githubUsername,
  lastSyncAt,
  atsScore = 88,
  repoCount = 8,
  pendingSuggestionsCount = 3,
  stackConfidence = 94,
  strongestDomain = "Full-Stack TypeScript",
  topSkills = ["TypeScript", "Next.js", "Redis"],
}: DashboardPixelBannerProps) {
  const repoTag = githubUsername ? `github.com/${githubUsername}` : "github.com/adel";

  // Format last sync string
  const formattedSync = lastSyncAt
    ? new Date(lastSyncAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Live Sync Active";

  return (
    <div className="mb-10 relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-white/10 shadow-2xl transition-all duration-300">
      {/* Pixel Sky Art Background matching landing page pipeline */}
      <img
        src="/images/fairweather_sky.jpg"
        alt="Pixel art clouds and sky"
        className="absolute inset-0 h-full w-full object-cover object-center scale-105 select-none pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Atmospheric vignette & gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/45 pointer-events-none" />

      {/* Analytics Content Layer on top of the Pixel Graphics */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[380px] lg:min-h-[400px]">
        {/* Top Header Bar on Sky */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            {/* GitHub Account Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-lg text-xs font-mono font-medium">
              <GitBranch className="w-3.5 h-3.5 text-blue-400" />
              <span>{repoTag}</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/80 font-medium font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ATS Parser Certified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/70 font-mono hidden md:inline">
              Last synced: {formattedSync}
            </span>
            <Link
              href="/editor"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-neutral-900 font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              <span>Resume Editor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Analytics & Metrics Grid on top of Pixel Graphics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: ATS Optimization Score */}
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#141417]/90 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-xl text-neutral-900 dark:text-[#f2efe9] hover:bg-white dark:hover:bg-[#18181c] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                ATS READINESS
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                {atsScore}%
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Market-Ready
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Greenhouse &amp; Lever parsed cleanly
            </p>
          </div>

          {/* Card 2: Stack Confidence & Tech Domain */}
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#141417]/90 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-xl text-neutral-900 dark:text-[#f2efe9] hover:bg-white dark:hover:bg-[#18181c] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                STACK CONFIDENCE
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-[#0099ff]">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                {stackConfidence}%
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-[#0099ff] text-[10px] font-bold border border-blue-500/20 truncate max-w-[110px]">
                {strongestDomain}
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium truncate">
              {topSkills.join(" · ")}
            </p>
          </div>

          {/* Card 3: Repositories & Engineering Telemetry */}
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#141417]/90 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-xl text-neutral-900 dark:text-[#f2efe9] hover:bg-white dark:hover:bg-[#18181c] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                REPOS ANALYZED
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                {repoCount}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[10px] font-bold border border-purple-500/20">
                Active Repos
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Google XYZ bullet metrics inferred
            </p>
          </div>

          {/* Card 4: AI Discoveries & Suggestions */}
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#141417]/90 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-xl text-neutral-900 dark:text-[#f2efe9] hover:bg-white dark:hover:bg-[#18181c] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                AI DISCOVERIES
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                {pendingSuggestionsCount}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                Pending Review
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              New commits ready to merge into CV
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
