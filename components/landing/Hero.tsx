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
  Star,
  Bell,
  Plus,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { GithubIcon } from "./Icons";

export function Hero() {
  const [atsScore, setAtsScore] = useState(0);
  const [activeRange, setActiveRange] = useState<"1h" | "24h" | "7d">("24h");
  const [statsMultiplier, setStatsMultiplier] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAtsScore(LANDING_CONFIG.realStats.avgAtsScore);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRangeChange = (range: "1h" | "24h" | "7d") => {
    setActiveRange(range);
    setStatsMultiplier(range === "1h" ? 0.4 : range === "24h" ? 1 : 2.5);
  };

  return (
    <section className="relative isolate pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#09090b] text-white">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-700/20 to-neutral-700/20 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Reference pill */}
          <div className="inline-flex items-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1 px-3.5 text-xs sm:text-sm text-neutral-300 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <span className="rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white border border-white/10">
                New
              </span>
              <span>{LANDING_CONFIG.brand.pillText.replace("New · ", "")}</span>
            </div>
          </div>

          {/* Heading matching reference */}
          <h1 className="mt-8 text-5xl font-normal sm:font-medium tracking-tight text-white sm:text-7xl leading-[1.08]">
            {LANDING_CONFIG.brand.tagline}
          </h1>

          {/* Subtext matching reference */}
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-neutral-400 leading-relaxed">
            {LANDING_CONFIG.brand.description}
          </p>

          {/* Call to action & social rating */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Link
              href={LANDING_CONFIG.brand.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#f2efe9] px-6 py-2.5 text-sm font-medium text-neutral-950 transition-all hover:bg-white shadow-[0_4px_14px_rgba(255,255,255,0.15)]"
            >
              <span>{LANDING_CONFIG.brand.primaryCta.label}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {LANDING_CONFIG.realStats.userCountText && (
              <div className="flex items-center gap-2 text-left">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">4.9 average</p>
                  <p className="text-[11px] text-neutral-400">{LANDING_CONFIG.realStats.userCountText}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Mockup Container (Exact match to reference dashboard screenshot) */}
        <div className="mt-16 mx-auto max-w-6xl rounded-t-3xl border-t border-x border-white/15 bg-[#fbfbfb] text-neutral-900 shadow-2xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="flex h-11 items-center justify-between border-b border-neutral-200/80 bg-neutral-100/70 px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-neutral-300" />
              <span className="h-3 w-3 rounded-full bg-neutral-300" />
              <span className="h-3 w-3 rounded-full bg-neutral-300" />
              <span className="ml-2 font-mono text-xs text-neutral-500">
                resummit.app/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
                • Synced with GitHub
              </span>
            </div>
          </div>

          {/* Inner Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* Left Mockup Sidebar */}
            <div className="hidden lg:flex lg:col-span-3 flex-col justify-between border-r border-neutral-200/80 p-4 bg-neutral-50">
              <div className="space-y-4">
                {/* Workspace Title */}
                <div className="flex items-center gap-2 px-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white font-bold text-xs">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Resummit</p>
                    <p className="text-[10px] text-neutral-500">Master CV Workspace</p>
                  </div>
                </div>

                {/* ⌘K Search Input */}
                <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-500 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Search</span>
                  </div>
                  <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500">
                    ⌘K
                  </kbd>
                </div>

                {/* Nav Items */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white shadow-sm">
                    <FileText className="h-4 w-4" />
                    <span>Master CV</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100">
                    <Layers className="h-4 w-4 text-neutral-400" />
                    <span>Tailored versions</span>
                    <span className="ml-auto rounded-full bg-neutral-200 px-1.5 py-0.2 text-[10px] font-semibold text-neutral-700">
                      2
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100">
                    <Sparkles className="h-4 w-4 text-neutral-400" />
                    <span>AI suggestions</span>
                    <span className="ml-auto rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-semibold text-blue-700">
                      3 new
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100">
                    <GitBranch className="h-4 w-4 text-neutral-400" />
                    <span>GitHub sync</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100">
                    <Download className="h-4 w-4 text-neutral-400" />
                    <span>Export PDF</span>
                  </div>
                </div>
              </div>

              {/* User Profile Card at Sidebar Bottom */}
              <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs">
                    <GithubIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-neutral-900 truncate">Jordan Ellis</p>
                    <p className="text-[10px] text-neutral-500 truncate">jordan@developer.dev</p>
                  </div>
                </div>
                <div className="flex items-center justify-around rounded-lg bg-neutral-100 p-1 text-[10px] text-neutral-600 font-medium">
                  <span className="rounded bg-white px-2 py-0.5 text-neutral-900 shadow-xs">Light</span>
                  <span>Dark</span>
                  <span>System</span>
                </div>
              </div>
            </div>

            {/* Main Area with Mountain Sky Header & Live Metrics */}
            <div className="lg:col-span-9 p-4 sm:p-6 space-y-6 bg-white">
              {/* Header Card with Mountains Image Background (matching reference!) */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-sm min-h-[160px] p-6 flex flex-col justify-between">
                <img
                  src="/images/fairweather_sky.jpg"
                  alt="Atmospheric mountains artwork"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-blue-700 uppercase">
                      Production CV Profile
                    </span>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
                      Senior Full-Stack Engineer
                    </h2>
                    <p className="text-xs text-neutral-600">
                      Auto-synced from 8 public repositories across 1,420 commits.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-neutral-200">
                      <Bell className="h-3.5 w-3.5 text-neutral-600" />
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm">
                      <Plus className="h-3.5 w-3.5" />
                      <span>New tailored version</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-3 pt-4">
                  <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">
                    <span>Deploy to job</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 text-xs font-medium text-neutral-800 shadow-xs hover:bg-white">
                    <span>Preview PDF</span>
                  </button>
                </div>
              </div>

              {/* Navigation Filter Pills and Date Range */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-neutral-900 px-3 py-1 text-xs font-medium text-white shadow-xs">
                    All projects
                  </span>
                  <span className="rounded-lg px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 cursor-pointer">
                    Skills
                  </span>
                  <span className="rounded-lg px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 cursor-pointer">
                    Experience
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-neutral-700 shadow-xs">
                    <span>Last 24 hours</span>
                    <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ATS Score Card */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-neutral-600">ATS Rating</p>
                      <p className="text-[11px] text-neutral-500">Target role calibration</p>
                    </div>
                    <div className="flex items-center gap-1 rounded bg-neutral-200/80 p-0.5 text-[10px]">
                      {(["1h", "24h", "7d"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => handleRangeChange(r)}
                          className={`rounded px-1.5 py-0.5 ${
                            activeRange === r ? "bg-white text-neutral-900 font-semibold shadow-xs" : "text-neutral-600"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-neutral-900">
                      {atsScore}
                    </span>
                    <span className="text-xs text-neutral-500">/ 100</span>
                    <span className="ml-auto text-xs font-medium text-emerald-600">
                      +12% vs standard
                    </span>
                  </div>

                  {/* Clean SVG sparkline */}
                  <div className="h-10 w-full pt-2">
                    <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
                      <path
                        d="M 0 18 Q 20 8, 40 14 T 70 6 T 100 10"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bullets Written Card */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-neutral-600">Bullets Synthesized</p>
                      <p className="text-[11px] text-neutral-500">Quantified metrics extracted</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-neutral-900">
                      {Math.round(24 * statsMultiplier)}
                    </span>
                    <span className="text-xs text-neutral-500">statements</span>
                  </div>

                  {/* Bar indicators */}
                  <div className="flex items-end gap-1.5 h-10 w-full pt-2">
                    {[40, 60, 45, 80, 65, 90, 75, 100, 85].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-xs transition-all ${
                          i === 7 ? "bg-neutral-900" : "bg-neutral-300"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">8 Public Repos</p>
                    <p className="text-[11px] text-neutral-500">Continuous commit scan active</p>
                  </div>
                  <span className="ml-auto font-mono text-xs font-semibold text-neutral-700">100%</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Zero Overwrites</p>
                    <p className="text-[11px] text-neutral-500">Manual edits always preserved</p>
                  </div>
                  <span className="ml-auto font-mono text-xs font-semibold text-emerald-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
