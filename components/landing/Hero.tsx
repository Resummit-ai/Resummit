"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/lib/landing-config";
import {
  FileText,
  GitBranch,
  Layers,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  Download,
} from "lucide-react";
import { GithubIcon } from "./Icons";

export function Hero() {
  const [atsScore, setAtsScore] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "projects" | "skills">("all");
  const [activeRange, setActiveRange] = useState<"1h" | "24h" | "7d">("24h");
  const [statsMultiplier, setStatsMultiplier] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAtsScore(LANDING_CONFIG.realStats.avgAtsScore);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleRangeChange = (range: "1h" | "24h" | "7d") => {
    setActiveRange(range);
    setStatsMultiplier(range === "1h" ? 0.3 : range === "24h" ? 1 : 2.4);
  };

  const ringRadius = 42;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <section className="relative isolate pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[rgb(10,10,10)] text-[rgb(242,239,233)]">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600/30 to-[rgb(242,239,233)]/10 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Animated Announcement Pill */}
          <div className="inline-flex items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 py-1 pr-3 pl-1 text-sm text-[rgba(242,239,233,0.8)] inset-ring inset-ring-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-500/30">
                New
              </span>
              <span>{LANDING_CONFIG.brand.pillText.replace("New · ", "")}</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </div>
          </div>

          {/* H1 Heading */}
          <h1 className="mt-8 text-5xl font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl text-[rgb(242,239,233)]">
            {LANDING_CONFIG.brand.tagline}
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-[48ch] text-base text-pretty text-[rgba(242,239,233,0.7)] sm:text-lg">
            {LANDING_CONFIG.brand.description}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={LANDING_CONFIG.brand.primaryCta.href}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[rgb(242,239,233)] px-6 py-2.5 text-sm font-medium text-neutral-950 transition-all hover:bg-[rgb(242,239,233)]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(242,239,233)] shadow-[0_0_20px_rgba(242,239,233,0.2)]"
            >
              {LANDING_CONFIG.brand.primaryCta.label}
            </Link>
            <a
              href={LANDING_CONFIG.brand.secondaryCta.href}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white/5 px-6 py-2.5 text-sm font-medium text-[rgb(242,239,233)] inset-ring inset-ring-white/10 transition-all hover:bg-white/10"
            >
              {LANDING_CONFIG.brand.secondaryCta.label}
            </a>
          </div>

          {/* Truth-rule real user count */}
          {LANDING_CONFIG.realStats.userCountText && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[rgba(242,239,233,0.6)]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{LANDING_CONFIG.realStats.userCountText}</span>
            </div>
          )}
        </div>

        {/* Code Dashboard Mock (No screenshots) */}
        <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-xl sm:p-4">
          <div className="rounded-xl border border-white/5 bg-[rgb(12,12,14)]/90 overflow-hidden shadow-inner">
            {/* Window bar */}
            <div className="flex h-11 items-center justify-between border-b border-white/10 px-4 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-xs text-[rgba(242,239,233,0.4)]">
                  resummit.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1 text-xs text-[rgba(242,239,233,0.6)] inset-ring inset-ring-white/10">
                  <Search className="h-3 w-3" />
                  <span>Quick find</span>
                  <kbd className="ml-2 rounded bg-black/40 px-1 text-[10px] text-white/50">⌘K</kbd>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400 inset-ring inset-ring-blue-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span>Live Sync</span>
                </div>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
              {/* Sidebar */}
              <div className="hidden md:flex md:col-span-3 flex-col justify-between border-r border-white/10 p-4 bg-white/[0.01]">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-[rgb(242,239,233)]">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span>Master CV</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[rgba(242,239,233,0.6)] hover:bg-white/5">
                      <Layers className="h-4 w-4" />
                      <span>Tailored Versions</span>
                      <span className="ml-auto rounded-full bg-white/10 px-1.5 text-[10px]">2</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[rgba(242,239,233,0.6)] hover:bg-white/5">
                      <Sparkles className="h-4 w-4" />
                      <span>AI Suggestions</span>
                      <span className="ml-auto rounded-full bg-blue-500/20 px-1.5 text-[10px] text-blue-400">
                        3 new
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[rgba(242,239,233,0.6)] hover:bg-white/5">
                      <GitBranch className="h-4 w-4" />
                      <span>GitHub Sync</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[rgba(242,239,233,0.6)] hover:bg-white/5">
                      <Download className="h-4 w-4" />
                      <span>Export PDF</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-xs font-bold text-white">
                    <GithubIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate text-left">
                    <p className="truncate text-xs font-medium text-[rgb(242,239,233)]">
                      Connected User
                    </p>
                    <p className="truncate text-[10px] text-[rgba(242,239,233,0.4)]">
                      3 public repos active
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Pane */}
              <div className="col-span-1 md:col-span-9 p-4 sm:p-6 space-y-6">
                {/* Filter and Range Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 rounded-lg bg-black/40 p-1 border border-white/5">
                    {(["all", "projects", "skills"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                          activeFilter === filter
                            ? "bg-[rgb(242,239,233)] text-neutral-950 shadow-sm"
                            : "text-[rgba(242,239,233,0.6)] hover:text-[rgb(242,239,233)]"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Range Toggles with count-up behavior */}
                  <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1 border border-white/10 text-xs">
                    {(["1h", "24h", "7d"] as const).map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => handleRangeChange(range)}
                        className={`rounded px-2.5 py-0.5 text-xs transition-colors ${
                          activeRange === range
                            ? "bg-white/20 text-[rgb(242,239,233)] font-medium"
                            : "text-[rgba(242,239,233,0.5)] hover:text-white"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[rgba(242,239,233,0.6)]">Repos Analyzed</p>
                      <p className="mt-1 text-2xl font-semibold text-[rgb(242,239,233)]">
                        {Math.round(8 * statsMultiplier)}
                      </p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <GitBranch className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[rgba(242,239,233,0.6)]">Bullets Synthesized</p>
                      <p className="mt-1 text-2xl font-semibold text-[rgb(242,239,233)]">
                        {Math.round(24 * statsMultiplier)}
                      </p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[rgba(242,239,233,0.6)]">Active Versions</p>
                      <p className="mt-1 text-2xl font-semibold text-[rgb(242,239,233)]">2</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Layers className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Score & Versions Split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Master CV Card with Animated ATS Score Ring */}
                  <div className="md:col-span-5 rounded-xl border border-white/10 bg-white/[0.02] p-5 flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-[rgba(242,239,233,0.6)]">
                      Master CV Score
                    </p>
                    <div className="relative mt-4 flex items-center justify-center">
                      <svg width="110" height="110" className="-rotate-90 transform">
                        <circle
                          cx="55"
                          cy="55"
                          r={ringRadius}
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="55"
                          cy="55"
                          r={ringRadius}
                          stroke="#2563eb"
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-[rgb(242,239,233)]">
                          {atsScore}
                        </span>
                        <span className="text-[10px] text-[rgba(242,239,233,0.5)]">ATS / 100</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Ready for applications</span>
                    </p>
                  </div>

                  {/* Tailored Versions List & GitHub Suggestions */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between text-xs font-medium text-[rgb(242,239,233)]">
                        <span>Frontend Engineer</span>
                        <span className="text-emerald-400">92% match</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                          style={{ width: "92%" }}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-[rgba(242,239,233,0.5)]">
                        Emphasized: Next.js 16, TypeScript, Tailwind, Webpack optimization
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between text-xs font-medium text-[rgb(242,239,233)]">
                        <span>Backend Engineer</span>
                        <span className="text-blue-400">80% match</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-700"
                          style={{ width: "80%" }}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-[rgba(242,239,233,0.5)]">
                        Emphasized: PostgreSQL, Prisma ORM, Redis caching, Auth.js
                      </p>
                    </div>

                    {/* New from GitHub Suggestion Card */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-3 flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                      <div className="text-left text-xs">
                        <p className="font-medium text-[rgb(242,239,233)]">
                          New bullet suggested from latest commit
                        </p>
                        <p className="text-[11px] text-[rgba(242,239,233,0.6)]">
                          &quot;Architected Redis caching layer, decreasing endpoint latency by 45%&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
