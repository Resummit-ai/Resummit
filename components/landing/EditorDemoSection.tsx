"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, GitCommit, Sparkles, Check, GitBranch } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function EditorDemoSection() {
  const [activeExample, setActiveExample] = useState(0);

  const examples = [
    {
      title: "Performance & Caching",
      category: "Backend",
      repo: "alex-dev/weather-app",
      commitSha: "a3f2c1e",
      commitMessage: "perf: add redis cache layer to weather service",
      diff: [
        "- const data = await fetchWeather(city);",
        "+ const cached = await redis.get(cacheKey);",
        "+ if (cached) return JSON.parse(cached);",
        "+ const data = await fetchWeather(city);",
        "+ await redis.set(cacheKey, JSON.stringify(data), 'EX', 3600);",
      ],
      bullet:
        "Architected an asynchronous Redis caching layer for weather API endpoints, reducing external request latency and eliminating upstream rate-limiting errors.",
      skills: ["Redis", "Node.js", "TypeScript", "Performance"],
    },
    {
      title: "Database Indexing",
      category: "Database",
      repo: "alex-dev/task-queue",
      commitSha: "9b4d11a",
      commitMessage: "optimize: add composite index on task status and created_at",
      diff: [
        "- CREATE INDEX idx_tasks_status ON tasks(status);",
        "+ CREATE INDEX idx_tasks_status_created ON tasks(status, created_at DESC);",
        "+ -- Reduces sequential scan overhead on worker job polling",
      ],
      bullet:
        "Engineered optimized PostgreSQL composite indices for distributed task polling, cutting queue worker scan overhead and preventing table contention under concurrent workloads.",
      skills: ["PostgreSQL", "Query Optimization", "Prisma"],
    },
    {
      title: "CI/CD Deployment",
      category: "DevOps",
      repo: "alex-dev/portfolio-platform",
      commitSha: "c7e802f",
      commitMessage: "ci: automate docker builds with multi-stage caching",
      diff: [
        "- docker build -t web-app .",
        "+ docker buildx build --cache-from=type=gha --cache-to=type=gha,mode=max -t web-app .",
        "+ # Shortens pipeline execution for pull requests",
      ],
      bullet:
        "Implemented automated GitHub Actions deployment pipelines using Docker Buildx and GitHub cache backends, accelerating CI build cycles for pull request validation.",
      skills: ["Docker", "GitHub Actions", "CI/CD"],
    },
  ];

  const current = examples[activeExample];

  return (
    <section className="bg-[#F5F5F3] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#f2efe9] py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-[#27272a] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-[#0099ff] border border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Commit to bullet demo</span>
            <span className="font-mono text-[10px] text-neutral-500">· Example</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-[#f2efe9] leading-[1.12]">
            From commit to bullet
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#707070] dark:text-[#f2efe9]/70 leading-relaxed font-normal">
            Resummit reads the real commits and READMEs in your public repositories to turn actual engineering contributions into recruiter-ready accomplishments.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mt-12 flex flex-wrap gap-2 border-b border-[#E5E5E5] dark:border-[#27272a] pb-4">
          {examples.map((ex, idx) => {
            const isActive = activeExample === idx;
            return (
              <button
                key={ex.title}
                type="button"
                onClick={() => setActiveExample(idx)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#171717] text-white dark:bg-white dark:text-black shadow-sm"
                    : "bg-white dark:bg-[#18181b] text-[#707070] dark:text-[#f2efe9]/70 hover:text-black dark:hover:text-white border border-[#E5E5E5] dark:border-[#27272a]"
                }`}
              >
                <span>{ex.title}</span>
                <span className="ml-2 text-[10px] opacity-70">({ex.category})</span>
              </button>
            );
          })}
        </div>

        {/* Split Commit -> Bullet Demonstration Card */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Raw Commit & Diff (Example) */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#121215] overflow-hidden flex flex-col justify-between shadow-sm dark:shadow-2xl">
            <div className="px-5 py-3.5 border-b border-[#E5E5E5] dark:border-[#27272a] bg-[#F7F7F6] dark:bg-[#16161a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-blue-600 dark:text-[#0099ff]" />
                <span className="text-xs font-mono font-medium text-[#171717] dark:text-[#f2efe9]/80 truncate">
                  {current.repo}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                Example
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-[#0099ff] bg-blue-500/10 px-2 py-0.5 rounded">
                    {current.commitSha}
                  </span>
                  <span className="text-xs font-mono text-[#52525b] dark:text-[#f2efe9]/70">
                    author: alex-dev
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#171717] dark:text-white pt-1">
                  {current.commitMessage}
                </p>
              </div>

              {/* Diff Snippet */}
              <div className="rounded-xl bg-[#0e0e12] p-4 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto border border-neutral-800">
                <div className="text-[10px] text-neutral-500 mb-2 border-b border-neutral-800 pb-1">
                  git diff HEAD~1
                </div>
                {current.diff.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith("+")
                        ? "text-emerald-400 bg-emerald-500/10 -mx-2 px-2 rounded"
                        : line.startsWith("-")
                        ? "text-rose-400 bg-rose-500/10 -mx-2 px-2 rounded"
                        : "text-neutral-500"
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#E5E5E5] dark:border-[#27272a] bg-[#F7F7F6] dark:bg-[#141417] flex items-center justify-between text-[11px] font-mono text-[#707070] dark:text-[#f2efe9]/50">
              <div className="flex items-center gap-1.5">
                <GitBranch size={12} />
                <span>main</span>
              </div>
              <span>Public repository metadata</span>
            </div>
          </div>

          {/* Right: Synthesized Resume Bullet (Example) */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E5E5E5] dark:border-[#27272a] bg-white dark:bg-[#141417] p-6 flex flex-col justify-between shadow-sm dark:shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#27272a]">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-mono font-medium text-[#171717] dark:text-[#f2efe9]">
                    Synthesized Resume Bullet
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  ATS-FRIENDLY FORMAT
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-[#F7F7F6] dark:bg-[#18181c] border border-[#E5E5E5] dark:border-[#27272a] p-5 text-sm text-[#171717] dark:text-[#f2efe9] leading-relaxed shadow-inner">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#0099ff] mt-2 shrink-0" />
                    <p className="font-serif text-[13px] sm:text-[14px] text-neutral-800 dark:text-neutral-100">
                      {current.bullet}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#707070] dark:text-[#f2efe9]/50 block">
                    Extracted Technical Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {current.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-mono bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 px-2.5 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5E5E5] dark:border-[#27272a] flex items-center justify-between text-xs text-[#707070] dark:text-[#f2efe9]/60">
              <span>Persona: Alex Developer · Sample (fictional)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Ready for export</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
