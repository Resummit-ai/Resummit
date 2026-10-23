"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/lib/landing-config";
import { motion } from "framer-motion";
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
  Check,
  ChevronDown,
} from "lucide-react";
import { GithubIcon } from "./Icons";

export function Hero() {
  const [atsScore, setAtsScore] = useState(0);
  const [activeRange, setActiveRange] = useState<"1h" | "24h" | "7d">("24h");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAtsScore(94);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Reference pill */}
          <div className="inline-flex items-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1 px-3.5 text-xs sm:text-sm text-neutral-300 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                New
              </span>
              <span>Tailor your CV to any job in seconds</span>
            </div>
          </div>

          {/* Heading matching reference font weight and tracking */}
          <h1 className="mt-8 text-5xl font-normal sm:font-medium tracking-tight text-white sm:text-7xl leading-[1.08]">
            Your CV that updates itself.
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-neutral-400 leading-relaxed">
            Connect GitHub, paste a target job description, and get an ATS-optimized CV tailored to that role. No manual writing, no broken templates.
          </p>

          {/* Call to action & social rating */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Link
              href={LANDING_CONFIG.brand.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-neutral-950 transition-all hover:bg-neutral-200 shadow-[0_4px_14px_rgba(255,255,255,0.15)] group"
            >
              <span>{LANDING_CONFIG.brand.primaryCta.label}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div className="flex items-center gap-2 text-left">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">4.9 average</p>
                <p className="text-[11px] text-neutral-400">Used by 31 developers</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Mockup Container — Featuring Our Real Resummit Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 mx-auto max-w-6xl rounded-t-3xl border-t border-x border-white/15 bg-[#fbfbfb] text-neutral-900 shadow-2xl overflow-hidden"
        >
          {/* Top Browser Bar */}
          <div className="flex h-11 items-center justify-between border-b border-neutral-200/80 bg-neutral-100/70 px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 font-mono text-xs text-neutral-500">
                resummit.app/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                3 REPOS SYNCED · ATS READY
              </span>
            </div>
          </div>

          {/* Inner Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
            {/* Left Mockup Sidebar */}
            <div className="hidden lg:flex lg:col-span-3 flex-col justify-between border-r border-neutral-200/80 p-4 bg-neutral-50">
              <div className="space-y-4">
                {/* Workspace Title */}
                <div className="flex items-center gap-2.5 px-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Resummit</p>
                    <p className="text-[10px] text-neutral-500">Developer Workspace</p>
                  </div>
                </div>

                {/* ⌘K Search Input */}
                <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-500 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Search skills, repos...</span>
                  </div>
                  <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500">
                    ⌘K
                  </kbd>
                </div>

                {/* Nav Items */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white shadow-xs">
                    <FileText className="h-4 w-4" />
                    <span>Master CV</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                    <Layers className="h-4 w-4 text-neutral-400" />
                    <span>Tailored versions</span>
                    <span className="ml-auto rounded-full bg-neutral-200 px-1.5 py-0.2 text-[10px] font-semibold text-neutral-700">
                      2
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                    <Sparkles className="h-4 w-4 text-neutral-400" />
                    <span>AI suggestions</span>
                    <span className="ml-auto rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-semibold text-blue-700">
                      3 new
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                    <GitBranch className="h-4 w-4 text-neutral-400" />
                    <span>GitHub sync</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                    <Download className="h-4 w-4 text-neutral-400" />
                    <span>Export PDF</span>
                  </div>
                </div>
              </div>

              {/* User Profile Card at Sidebar Bottom */}
              <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs">
                    <GithubIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-neutral-900 truncate">Alex Carter</p>
                    <p className="text-[10px] text-neutral-500 truncate">alex.dev@github</p>
                  </div>
                </div>
                <div className="flex items-center justify-around rounded-lg bg-neutral-100 p-1 text-[10px] text-neutral-600 font-medium">
                  <span className="rounded bg-white px-2 py-0.5 text-neutral-900 shadow-xs">Light</span>
                  <span>Dark</span>
                  <span>System</span>
                </div>
              </div>
            </div>

            {/* Main Area: Resummit Real Dashboard View */}
            <div className="lg:col-span-9 p-4 sm:p-6 space-y-6 bg-white overflow-hidden">
              {/* Top Banner with Fairweather Mountain Sky Artwork */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-xs min-h-[170px] p-6 flex flex-col justify-between">
                <img
                  src="/images/fairweather_sky.jpg"
                  alt="Atmospheric clouds artwork"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider text-blue-700 uppercase">
                      Active Resume Profile
                    </span>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950">
                      Senior Software Engineer
                    </h2>
                    <p className="text-xs text-neutral-600">
                      Auto-synced from 8 public repositories across 1,420 commits.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xs border border-neutral-200 hover:bg-neutral-50">
                      <Bell className="h-3.5 w-3.5 text-neutral-600" />
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-neutral-800 transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                      <span>New tailored version</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-3 pt-3">
                  <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs">
                    <span>Deploy to job application</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-neutral-800 shadow-xs hover:bg-white">
                    <span>Preview PDF</span>
                  </button>
                </div>
              </div>

              {/* Real Resummit Git-to-Resume Preview Split (matching original localhost 3000) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: GitHub Repository Analysis */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <GithubIcon className="h-4 w-4 text-neutral-800" />
                      <span className="font-semibold text-xs text-neutral-900">weather-app</span>
                      <span className="rounded bg-neutral-200 px-1.5 py-0.2 text-[10px] font-mono text-neutral-600">
                        public
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">main</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <span className="text-blue-600 font-semibold">a3f2c1e</span>
                      <span className="truncate">feat: add real-time weather api integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <span className="text-blue-600 font-semibold">c9a1b3d</span>
                      <span className="truncate">perf: cache layer with Redis & async workers</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Next.js 15", "TypeScript", "Prisma", "Redis"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Real Synthesized ATS Resume Output */}
                <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Alex Carter</div>
                      <div className="text-[10px] text-neutral-500">Software Engineer</div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <Check className="h-3 w-3" />
                      ATS 98%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-neutral-700 leading-relaxed font-sans">
                    <p className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                      <span>
                        Architected an asynchronous <strong>weather intelligence platform</strong> using Next.js and TypeScript, serving 12k+ daily requests with 99.9% uptime.
                      </span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                      <span>
                        Engineered a <strong>Redis caching layer</strong> for external API calls, cutting response latency by 42% and eliminating rate-limited errors.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Lower Live Metrics Row (from Aceternity & Resummit dashboard) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Metric 1: ATS Score with Live SVG sparkline */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>ATS Rating</span>
                    <span className="text-emerald-600 font-semibold">+12% vs standard</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-neutral-900">
                      {atsScore}
                    </span>
                    <span className="text-xs text-neutral-500">/ 100</span>
                  </div>
                  {/* Sparkline curve */}
                  <div className="mt-3 h-8 w-full">
                    <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
                      <path
                        d="M 0,18 Q 20,20 40,16 T 70,8 T 100,6"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="100" cy="6" r="3" fill="#2563eb" />
                    </svg>
                  </div>
                </div>

                {/* Metric 2: Bullets Synthesized */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>Bullets Synthesized</span>
                    <span className="text-blue-600 font-semibold font-mono">14.8/s</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-neutral-900">24</span>
                    <span className="text-xs text-neutral-500">statements</span>
                  </div>
                  {/* Bar indicators */}
                  <div className="mt-4 flex items-end gap-1.5 h-6">
                    {[40, 55, 35, 70, 60, 85, 95, 100].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`flex-1 rounded-t-xs ${
                          i >= 6 ? "bg-neutral-900" : "bg-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Metric 3: Real Sync Status */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-neutral-500">Continuous Sync</div>
                    <div className="mt-2 text-sm font-semibold text-neutral-900">
                      8 Repositories Active
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-500 leading-normal">
                      Webhook listening for GitHub pushes. Edits never overwritten.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between text-[11px] font-mono text-emerald-600 font-medium">
                    <span>Strict read-only</span>
                    <span>100% active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
