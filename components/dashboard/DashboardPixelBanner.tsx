"use client";

import React from "react";
import { CheckCircle2, GitBranch, Sparkles } from "lucide-react";

interface DashboardPixelBannerProps {
  githubUsername?: string | null;
  lastSyncAt?: string | null;
}

export function DashboardPixelBanner({ githubUsername, lastSyncAt }: DashboardPixelBannerProps) {
  const repoTag = githubUsername ? `github.com/${githubUsername}` : "github.com/developer/portfolio";

  return (
    <div className="mb-10 relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-white/10 shadow-2xl min-h-[380px] sm:min-h-[420px] flex items-center justify-center p-6 sm:p-10 transition-all duration-300">
      {/* Pixel Sky Art Background matching landing page pipeline */}
      <img
        src="/images/fairweather_sky.jpg"
        alt="Pixel art clouds and sky"
        className="absolute inset-0 h-full w-full object-cover object-center scale-105 select-none pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25 pointer-events-none" />

      {/* Floating White Telemetry Card from Screenshot */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/95 dark:bg-[#141417]/95 backdrop-blur-md p-6 text-neutral-900 dark:text-[#f2efe9] shadow-2xl border border-white/60 dark:border-white/10 transition-all duration-300">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400 font-medium truncate max-w-[240px]">
            {repoTag}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Big Metric Display */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
            4.8 sec
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
            EXECUTION
          </span>
        </div>

        {/* Telemetry Checklist */}
        <div className="mt-5 space-y-2.5 border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">Scan Git repos</span>
            </div>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">1.2s</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">Parse PRs &amp; diffs</span>
            </div>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">2.1s</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">Quantify impact (XYZ)</span>
            </div>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">1.1s</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">Format ATS bullets</span>
            </div>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">0.4s</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-5 border-t border-neutral-200/80 dark:border-neutral-800 pt-3 text-center">
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            From git push to interview-ready bullet
          </p>
        </div>
      </div>
    </div>
  );
}
