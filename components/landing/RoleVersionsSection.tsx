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
      prompt: "Summarize infrastructure optimizations:",
      bullets: [
        "Automated multi-region Kubernetes cluster provisioning with Terraform, cutting deployment time from 2 hours to 8 minutes.",
        "Configured Prometheus & Grafana alerting pipelines, dropping mean-time-to-detection (MTTD) by 70%.",
        "Enforced strict IAM least-privilege security roles across 12 production AWS accounts.",
      ],
    },
  ];

  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const currentRole = roles[activeRoleIndex];

  return (
    <section id="roles" className="scroll-mt-12 bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Section Header & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
              <span>✳</span>
              <span>Role catalog</span>
            </div>

            <h2 className="text-4xl font-normal sm:font-medium tracking-tight text-white sm:text-5xl leading-[1.15]">
              Every developer role, ready to export
            </h2>

            <p className="text-base text-neutral-400 leading-relaxed">
              Pick from tailored presets for Backend, Frontend, Fullstack, AI/ML, and DevOps. Each version weights your repositories to match recruiter requirements.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={LANDING_CONFIG.brand.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-white/40 shadow-sm"
              >
                <span>Browse all roles</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="rounded-full border border-neutral-800 bg-[#121215] px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
              >
                Create custom role
              </button>
            </div>
          </div>

          {/* Right: Role Card with Vertical Icon Rail (Exact match to reference) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden flex shadow-2xl">
              {/* Vertical Icon Rail */}
              <div className="w-14 shrink-0 border-r border-neutral-800 bg-[#121217] p-2 flex flex-col items-center gap-3">
                {roles.map((role, idx) => {
                  const isActive = activeRoleIndex === idx;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setActiveRoleIndex(idx)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? "bg-neutral-800 text-sky-400 shadow-sm border border-neutral-700"
                          : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
                      }`}
                      title={role.name}
                    >
                      {idx === 0 && <Layers className="h-5 w-5" />}
                      {idx === 1 && <Server className="h-5 w-5" />}
                      {idx === 2 && <BrainCircuit className="h-5 w-5" />}
                      {idx === 3 && <Cloud className="h-5 w-5" />}
                    </button>
                  );
                })}
              </div>

              {/* Main Role Details Panel */}
              <div className="flex-1 p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-sky-400 font-semibold uppercase tracking-wider">
                      Target Profile
                    </span>
                  </div>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">
                    {currentRole.name}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                    {currentRole.tagline}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentRole.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-md border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-xs font-mono text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulated Synthesis Card */}
                <div className="space-y-3 pt-2 border-t border-neutral-800/80">
                  {/* Prompt */}
                  <div className="inline-block rounded-xl bg-neutral-800/80 px-3.5 py-2 text-xs text-neutral-300">
                    {currentRole.prompt}
                  </div>

                  {/* Bullet points generated */}
                  <div className="rounded-xl border border-neutral-800 bg-[#14141a] p-4 space-y-2.5">
                    {currentRole.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Status */}
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-800/80">
                  <span>ATS Match: 98%</span>
                  <span className="text-emerald-400">Ready to export</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
