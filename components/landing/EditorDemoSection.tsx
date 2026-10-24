"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Copy, Check, Terminal, Zap } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function EditorDemoSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [streamIndex, setStreamIndex] = useState(165);

  const tabs = [
    { name: "Commit diffs", desc: "Parsed line-by-line" },
    { name: "Repo README", desc: "Architecture & tech stack" },
    { name: "Multiple repos", badge: "Included", desc: "Sync all your public repositories" },
    { name: "Role tuning", desc: "Tailored to job description" },
    { name: "ATS format", badge: "Clean", desc: "Standard single column" },
  ];

  const codeSnippets = [
    `// Example: Commit & README synthesis
const input = {
  repository: "github.com/alex-dev/weather-app",
  commit: "feat: add redis cache layer to reduce external api latency",
  languages: ["TypeScript", "Next.js", "Redis"],
};

// Resulting ATS-friendly bullet:
// "Architected Redis caching layer for weather API calls, cutting response latency by 42% and eliminating rate-limited errors."`,

    `// Example: README & Architecture extraction
const input = {
  repository: "github.com/alex-dev/d-runner",
  readme: "Lightweight distributed task runner in Go with worker queue and retries.",
  languages: ["Go", "Docker", "gRPC"],
};

// Resulting ATS-friendly bullet:
// "Built worker queue with automatic retry policies and Prometheus metrics, orchestrating 50 concurrent jobs."`,

    `// Example: Public repository import
const input = {
  user: "alex-carter",
  publicRepositories: 6,
  techStackDetected: ["TypeScript", "Python", "Go", "PostgreSQL", "Redis"],
};

// Resulting ATS-friendly bullet:
// "Integrated multi-service PostgreSQL database layer with connection pooling, handling concurrent user queries."`,

    `// Example: Tailor to a job description
const targetRole = "Backend Software Engineer";
const jobRequirements = ["Distributed Systems", "Redis", "TypeScript", "High Availability"];

// Resulting tailored bullet:
// "Engineered asynchronous task queues with Redis, supporting high-throughput background processing with zero drop rate."`,

    `// Example: ATS compliance verification
const documentChecks = {
  columnLayout: "Single column",
  headings: "Standard ATS (Experience, Projects, Education, Skills)",
  textSelectable: true,
  tableFormatting: "None (ATS clean)",
};

// Verified: Single-column PDF ready for recruiter review`
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullResponseTexts = [
    "Architected an asynchronous weather intelligence platform using Next.js and TypeScript, serving daily requests with high availability. Engineered a Redis caching layer for external API calls, cutting response latency by 42% and eliminating rate-limited errors.",
    "Built a distributed worker queue in Go with Prometheus metrics and retry policies, processing concurrent background jobs reliably under variable system loads.",
    "Integrated PostgreSQL database schemas with optimized indices and connection pooling across 6 public repositories, improving response consistency.",
    "Tailored resume bullet points for Backend roles: elevated distributed systems, caching patterns, and concurrency metrics to the top project sections.",
    "Formatted resume into single-column layout with standard section headings and selectable text for recruiter ATS compatibility."
  ];

  const handleRun = () => {
    setIsRunning(true);
    setStreamIndex(0);
    let current = 0;
    const target = fullResponseTexts[activeTab].length;
    const interval = setInterval(() => {
      current += 4;
      setStreamIndex(current);
      if (current >= target + 10) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 20);
  };

  const displayedText = fullResponseTexts[activeTab].slice(0, streamIndex);

  return (
    <section className="bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title Header */}
        <div className="max-w-3xl">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-[#0099ff] mb-3">
            DEVELOPER FIRST
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-[#f2efe9] leading-[1.12]">
            Paste one repo link. Keep the code you have.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#707070] dark:text-[#f2efe9]/70 leading-relaxed font-normal">
            Resummit speaks your Git history, so the work you push every day turns directly into quantifiable achievements without rewriting your life.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={LANDING_CONFIG.brand.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#171717] dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-black transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm"
            >
              <span>Try the live builder</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-neutral-300 dark:border-[#27272a] bg-white dark:bg-[#141417] px-5 py-2.5 text-sm font-semibold text-[#171717] dark:text-[#f2efe9]/80 hover:text-blue-600 dark:hover:text-[#f2efe9] hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors shadow-sm"
            >
              Connect GitHub
            </Link>
          </div>
        </div>

        {/* 5 Horizontal Tabs with Active Top Line */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 border-b border-[#E5E5E5] dark:border-[#27272a] pb-4">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => {
                  setActiveTab(idx);
                  setStreamIndex(fullResponseTexts[idx].length);
                }}
                className="text-left group transition-all"
              >
                <div
                  className={`h-[2px] w-full transition-all duration-300 ${isActive ? "bg-[#0099ff]" : "bg-transparent group-hover:bg-neutral-300 dark:group-hover:bg-neutral-800"
                    }`}
                />
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold transition-colors ${isActive
                        ? "text-[#171717] dark:text-[#f2efe9]"
                        : "text-[#707070] dark:text-[#f2efe9]/60 group-hover:text-black dark:group-hover:text-[#f2efe9]"
                      }`}
                  >
                    {tab.name}
                  </span>
                  {tab.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${tab.badge === "50% off"
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                          : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#52525b] dark:text-[#f2efe9]/60">{tab.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Split Editor + Output Window (Matches referral site layout) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Code Block with Syntax Highlighting and Run Button */}
          <div className="lg:col-span-7 rounded-2xl border border-[#27272a] bg-[#121215] overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Editor Header Bar */}
            <div className="px-4 py-3 border-b border-[#27272a] bg-[#16161a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#0099ff]" />
                <span className="text-xs font-mono text-[#f2efe9]/70">example.ts</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-md bg-[#222227] px-2.5 py-1 text-xs text-[#f2efe9]/70 hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-medium text-black hover:bg-neutral-200 transition-colors shadow-sm disabled:opacity-60"
                >
                  <Play className={`h-3 w-3 fill-black ${isRunning ? "animate-spin" : ""}`} />
                  <span>{isRunning ? "Running..." : "Run"}</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-xs text-[#f2efe9]/90 leading-relaxed overflow-x-auto whitespace-pre">
              <code>{codeSnippets[activeTab]}</code>
            </div>

            {/* Editor Footer Status */}
            <div className="px-6 py-3 border-t border-[#27272a] bg-[#141417] flex items-center justify-between text-[11px] font-mono text-[#f2efe9]/50">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Example · Commit-to-bullet generation</span>
              </div>
              <span>Click &quot;Run&quot; to test example</span>
            </div>
          </div>

          {/* Right: Live Stream Output / Candidate Response Card */}
          <div className="lg:col-span-5 rounded-2xl border border-[#27272a] bg-[#141417] p-6 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Output Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#0099ff]" />
                  <span className="text-xs font-mono font-medium text-[#f2efe9]">Synthesis Output (Example)</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  EXAMPLE
                </span>
              </div>

              {/* Streaming Content Window */}
              <div className="mt-5 space-y-3">
                <div className="rounded-xl bg-[#18181c] border border-[#27272a] p-4 text-xs font-mono text-[#f2efe9]/90 leading-relaxed min-h-[140px]">
                  <p>
                    {displayedText}
                    {isRunning && <span className="inline-block animate-pulse text-[#0099ff] font-bold">▌</span>}
                  </p>
                </div>

                <div className="text-[11px] text-[#f2efe9]/60 font-sans">
                  Formula: <strong className="text-[#f2efe9] font-medium">Accomplishment-focused format</strong> [What you built + Technical context + Impact].
                </div>
              </div>
            </div>

            {/* Output Metrics Bar */}
            <div className="mt-6 pt-4 border-t border-[#27272a] grid grid-cols-3 gap-2 text-center font-mono">
              <div>
                <span className="block text-[10px] text-[#f2efe9]/50 uppercase">Time (Example)</span>
                <span className="text-sm font-medium text-[#f2efe9]">~1 min</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#f2efe9]/50 uppercase">Match (Example)</span>
                <span className="text-sm font-medium text-[#f2efe9]">92%</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#f2efe9]/50 uppercase">Bullets (Example)</span>
                <span className="text-sm font-medium text-emerald-400">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
