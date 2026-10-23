"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Download, Cpu, FileCheck2, Sparkles, Sliders } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function ResumePreviewSection() {
  const [activeTab, setActiveTab] = useState<"full" | "experience" | "projects">("full");

  return (
    <section id="preview-resume" className="scroll-mt-12 bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Rendered Single-Page Resume of Alex Developer */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-700 bg-white text-neutral-900 shadow-2xl overflow-hidden p-6 sm:p-8 font-sans text-xs">
              {/* Resume Header */}
              <div className="border-b border-neutral-300 pb-4 text-center">
                <h3 className="text-xl font-bold tracking-tight text-neutral-950 uppercase font-sans">
                  Alex Developer
                </h3>
                <p className="mt-1 text-[11px] text-neutral-600 font-mono">
                  San Francisco, CA (Open to Remote) · alex.dev@email.com · github.com/alex-dev · linkedin.com/in/alex-developer
                </p>
              </div>

              {/* Technical Summary */}
              <div className="mt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
                  Technical Summary
                </h4>
                <p className="mt-1.5 text-[11px] text-neutral-700 leading-relaxed">
                  Innovative Full-Stack Software Engineer expert in building high-throughput distributed systems and AI capabilities. Proficient in TypeScript, Next.js, Go, PostgreSQL, Redis, and AWS. Adept at transforming complex data streams into production-grade applications that drive business value.
                </p>
              </div>

              {/* Technical Skills */}
              <div className="mt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
                  Technical Skills
                </h4>
                <div className="mt-1.5 space-y-1 text-[11px] text-neutral-700">
                  <p><strong>Languages:</strong> TypeScript, JavaScript, Python, Go, SQL</p>
                  <p><strong>Frameworks:</strong> Next.js 15, React, Node.js, Express, Tailwind CSS, Prisma</p>
                  <p><strong>Infrastructure & Tools:</strong> AWS, PostgreSQL, Redis, Docker, Git, GitHub Actions, Vercel</p>
                </div>
              </div>

              {/* Professional Experience */}
              <div className="mt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
                  Professional Experience
                </h4>
                <div className="mt-2 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between font-semibold text-[11px] text-neutral-900">
                      <span>Software Engineer · Core Systems</span>
                      <span className="font-mono text-[10px] text-neutral-500">2024 — Present</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[11px] text-neutral-700 list-disc list-inside">
                      <li>Architected an asynchronous event-streaming pipeline in TypeScript & Redis, handling 14k+ daily mutations with 99.9% uptime.</li>
                      <li>Engineered optimistic UI mutation cache with Server Actions, cutting user-perceived latency by 45%.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center justify-between font-semibold text-[11px] text-neutral-900">
                      <span>Full-Stack Developer Intern · AI Labs</span>
                      <span className="font-mono text-[10px] text-neutral-500">2023 — 2024</span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[11px] text-neutral-700 list-disc list-inside">
                      <li>Integrated LLM document retrieval with pgvector embeddings, improving semantic answer relevancy by 32%.</li>
                      <li>Refactored Postgres indexing and connection pools, eliminating database deadlock incidents during traffic peaks.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Projects */}
              <div className="mt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
                  Featured Projects (from GitHub)
                </h4>
                <div className="mt-2 space-y-2 text-[11px] text-neutral-700">
                  <div>
                    <div className="flex items-center justify-between font-semibold text-neutral-900">
                      <span>weather-intelligence-platform · github.com/alex-dev/weather-app</span>
                      <span className="font-mono text-[10px] text-neutral-500">Next.js, Redis, Prisma</span>
                    </div>
                    <p className="mt-0.5 text-neutral-600">
                      Real-time forecasting platform with distributed caching. Automated fallback workers cut external API costs by 40%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: ATS Audit Score & Feature Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-medium text-sky-400">
              <span>✳</span>
              <span>Interactive Output</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white leading-[1.12]">
              Recruiter-Ready. ATS-Optimized.
            </h2>

            <p className="text-base text-neutral-400 leading-relaxed">
              Here is a real resume generated from developer commits. It uses professional formatting, clean hierarchy, and is certified for corporate Applicant Tracking Systems.
            </p>

            {/* ATS Score Meter Card */}
            <div className="rounded-2xl border border-neutral-800 bg-[#121217] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-400">ATS Pass Certification</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">98 / 100 Score</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Check className="h-6 w-6" strokeWidth={2.5} />
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1">
                    <span>ATS Layout & Hierarchy</span>
                    <span className="font-mono text-emerald-400">100%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1">
                    <span>Google XYZ Impact Metrics</span>
                    <span className="font-mono text-emerald-400">96%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[96%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1">
                    <span>Technical Keyword Density</span>
                    <span className="font-mono text-emerald-400">94%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[94%]" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Greenhouse · Lever · Workday</span>
                <span className="text-emerald-400">Certified Compatible</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={LANDING_CONFIG.brand.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 shadow-md"
              >
                <span>Generate your CV like this</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
