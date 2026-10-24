"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Server, BrainCircuit, Cloud, Layers, Check } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function RoleVersionsSection() {
  const roles = [
    {
      id: "fullstack",
      name: "Senior Full-Stack Engineer",
      tagline: "End-to-end web architectures, high-performance APIs, and reactive interfaces.",
      tags: ["TypeScript", "Next.js 15", "PostgreSQL", "Tailwind", "+6 skills"],
      prompt: "Which commits demonstrate full-stack ownership?",
      bullets: [
        "Architected end-to-end multi-tenant dashboard with Next.js App Router and Prisma, serving 14,000 active users.",
        "Implemented optimistic UI state and server actions, reducing user-perceived mutation latency by 65%.",
        "Configured end-to-end CI/CD test automation covering unit, integration, and Playwright workflows.",
      ],
    },
    {
      id: "backend",
      name: "Distributed Systems & Backend",
      tagline: "High-throughput microservices, concurrency, database query tuning, and cache architecture.",
      tags: ["Go", "PostgreSQL", "Kafka", "Docker", "+4 skills"],
      prompt: "Show system scale and concurrency metrics:",
      bullets: [
        "Engineered concurrent event broker handling 50,000 events/sec with <15ms p95 latency.",
        "Refactored Postgres connection pooling and schema indices, eliminating query timeouts under traffic spikes.",
        "Implemented distributed tracing with OpenTelemetry across 8 containerized microservices.",
      ],
    },
    {
      id: "ai",
      name: "AI & LLM Application Engineer",
      tagline: "RAG pipelines, vector search, model fine-tuning, and low-latency inference serving.",
      tags: ["Python", "PyTorch", "vLLM", "Vector DBs", "+5 skills"],
      prompt: "Highlight production AI features shipped:",
      bullets: [
        "Built production RAG pipeline using pgvector and hybrid BM25 search, improving retrieval accuracy by 28%.",
        "Optimized LLM streaming token generation latency from 140ms to 42ms using vLLM and TensorRT-LLM.",
        "Evaluated model drift and Hallucination rates with automated synthetic test harnesses.",
      ],
    },
    {
      id: "devops",
      name: "DevOps & Cloud Infrastructure",
      tagline: "Kubernetes orchestration, Terraform automation, and 99.99% uptime reliability.",
      tags: ["Kubernetes", "AWS", "Terraform", "GitHub Actions", "+4 skills"],
      prompt: "Demonstrate cloud reliability and automation:",
      bullets: [
        "Provisioned multi-region AWS EKS clusters using Terraform modules with zero-downtime failover.",
        "Reduced mean time to deploy from 45 minutes to 7 minutes with GitHub Actions and Docker caching.",
        "Implemented Datadog synthetic monitoring and PagerDuty alert escalation matrices for 99.99% SLO.",
      ],
    },
    {
      id: "frontend",
      name: "Frontend Architect",
      tagline: "Design systems, performance budgets, WebGL/Canvas micro-animations, and accessibility.",
      tags: ["React 19", "CSS Architecture", "TypeScript", "Vite", "+5 skills"],
      prompt: "Highlight UI performance and engineering design:",
      bullets: [
        "Authored company-wide enterprise design system components adopted by 12 distinct product squads.",
        "Optimized Core Web Vitals (LCP: 1.1s, CLS: 0.01) by pruning unneeded dependencies and bundling split chunks.",
        "Achieved 100% WCAG 2.1 AA accessibility score across user-facing checkout and dashboard surfaces.",
      ],
    },
  ];

  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const currentRole = roles[activeRoleIndex];

  return (
    <section
      id="roles"
      className="scroll-mt-12 bg-[#F5F5F3] dark:bg-[#09090b] text-[#171717] dark:text-white py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-neutral-900 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Section Header & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-sky-400">
              <span>✳</span>
              <span>Job description tailoring</span>
            </div>

            <h2 className="text-4xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-white sm:text-5xl leading-[1.15]">
              One CV per job
            </h2>

            <p className="text-base text-[#707070] dark:text-neutral-400 leading-relaxed">
              Tailor your CV to any job description. Generate targeted versions for Full-Stack, Backend, Frontend, or DevOps from the same GitHub foundation without maintaining separate files.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={LANDING_CONFIG.brand.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-800 bg-[#171717] dark:bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 shadow-sm"
              >
                <span>Tailor my CV free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: Role Card with Vertical Icon Rail */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E5E5E5] dark:border-neutral-800/80 bg-white dark:bg-[#0e0e12] overflow-hidden flex shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-300">
              {/* Vertical Icon Rail */}
              <div className="w-14 shrink-0 border-r border-[#E5E5E5] dark:border-neutral-800 bg-[#F7F7F6] dark:bg-[#121217] p-2 flex flex-col items-center gap-3">
                {roles.map((role, idx) => {
                  const isActive = activeRoleIndex === idx;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setActiveRoleIndex(idx)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-sky-400 shadow-sm border border-[#E5E5E5] dark:border-neutral-700"
                          : "text-[#707070] dark:text-neutral-500 hover:text-black dark:hover:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-900"
                      }`}
                      title={role.name}
                    >
                      {idx === 0 && <Layers className="h-5 w-5" />}
                      {idx === 1 && <Server className="h-5 w-5" />}
                      {idx === 2 && <BrainCircuit className="h-5 w-5" />}
                      {idx === 3 && <Cloud className="h-5 w-5" />}
                      {idx === 4 && <Code2 className="h-5 w-5" />}
                    </button>
                  );
                })}
              </div>

              {/* Main Role Content */}
              <div className="p-6 sm:p-8 flex-1 space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-blue-600 dark:text-sky-400 font-semibold">
                      Target Role
                    </span>
                    <span className="font-mono text-xs text-[#707070] dark:text-neutral-500">
                      Preset 0{activeRoleIndex + 1}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#171717] dark:text-white mt-1">
                    {currentRole.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    {currentRole.tagline}
                  </p>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-[#E5E5E5] dark:border-neutral-800/80">
                  {currentRole.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[#E5E5E5] dark:border-neutral-800 bg-[#F7F7F6] dark:bg-neutral-900 px-2.5 py-1 text-[11px] font-mono text-[#171717] dark:text-neutral-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Highlighted Bullets */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                    {currentRole.prompt}
                  </p>
                  <div className="space-y-2.5">
                    {currentRole.bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
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
