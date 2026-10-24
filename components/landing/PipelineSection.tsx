"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, FileText, GitBranch } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function PipelineSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "sync",
      title: "1. Read public repositories",
      description:
        "Connect your GitHub profile with read-only access. Resummit reads repository READMEs, tech stacks, and commit messages to identify what you built.",
      metricTime: "Read-only",
      breakdown: [
        { label: "Scan public repositories", time: "Included" },
        { label: "Analyze project READMEs", time: "Included" },
        { label: "Extract tech stack & tools", time: "Included" },
        { label: "Safe read-only permissions", time: "Enforced" },
      ],
      tag: "github.com/developer/portfolio",
      footer: "Safe read-only access · Never modifies your code",
    },
    {
      id: "tailor",
      title: "2. Tailor CV to job description",
      description:
        "Paste any job description you are targeting. Resummit aligns your projects and highlights the exact technologies and accomplishments recruiters want to see.",
      metricTime: "Targeted",
      breakdown: [
        { label: "Analyze job requirements", time: "Semantic" },
        { label: "Match candidate projects", time: "Targeted" },
        { label: "Highlight core competencies", time: "Optimized" },
        { label: "Identify technical skill gaps", time: "Active" },
      ],
      tag: "resume.engine/tailor",
      footer: "Tailor your CV to any job description in seconds",
    },
    {
      id: "roles",
      title: "3. Role-specific versions",
      description:
        "Generate specialized versions for Full-Stack, Backend, Frontend, or DevOps from the same GitHub foundation without maintaining separate files.",
      metricTime: "Multi-Role",
      breakdown: [
        { label: "Full-Stack focus", time: "Ready" },
        { label: "Backend & Systems", time: "Ready" },
        { label: "Frontend & UI", time: "Ready" },
        { label: "Cloud & DevOps", time: "Ready" },
      ],
      tag: "resume.engine/roles",
      footer: "One source of truth, tailored for every application",
    },
    {
      id: "ats",
      title: "4. ATS-friendly export",
      description:
        "Export a clean, single-column standard PDF with standard section headers, legible system typography, and zero unparseable layout artifacts.",
      metricTime: "A4 / Standard",
      breakdown: [
        { label: "Single-column structure", time: "Standard" },
        { label: "Standard ATS font hierarchy", time: "Clean" },
        { label: "Zero unparseable tables", time: "Verified" },
        { label: "Crisp vector PDF export", time: "Instant" },
      ],
      tag: "export.resummit.app/pdf-engine",
      footer: "ATS-friendly, single-column format",
    },
  ];

  const currentTab = tabs[activeTab];

  return (
    <section
      id="pipeline"
      className="scroll-mt-12 bg-[#F5F5F3] dark:bg-[#09090b] text-[#171717] dark:text-white py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-neutral-900 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-[#0099ff] border border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Workflow pipeline</span>
          </div>
          <h2 className="text-4xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-white sm:text-5xl leading-[1.15]">
            How it works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-normal">
            Connect GitHub, paste a job description, and tailor your CV to any role in seconds.
          </p>
        </div>

        {/* Product Workflow Container with Floating Live Status Card */}
        <div className="mt-12 relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 shadow-2xl min-h-[460px] sm:min-h-[500px] flex items-center justify-center p-6 sm:p-12">
          {/* Subtle grid background pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/15 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />

          {/* Floating White Card */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/95 dark:bg-[#16161a]/95 backdrop-blur-md p-6 text-neutral-900 dark:text-neutral-100 shadow-2xl border border-neutral-200 dark:border-neutral-800 transition-all duration-300">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {currentTab.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            {/* Big Metric Display */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
                {currentTab.metricTime}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">
                pipeline phase
              </span>
            </div>

            {/* Checklist Items */}
            <div className="mt-5 space-y-2.5 border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
              {currentTab.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">{item.label}</span>
                  </div>
                  <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{item.time}</span>
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="mt-5 border-t border-neutral-200/80 dark:border-neutral-800 pt-3 text-center">
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{currentTab.footer}</p>
            </div>
          </div>
        </div>

        {/* 4 Interactive Clickable Process Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`text-left rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-blue-600 dark:border-[#0099ff] bg-white dark:bg-[#141417] shadow-lg scale-[1.01]"
                    : "border-[#E5E5E5] dark:border-neutral-800/80 bg-white/60 dark:bg-[#111114]/60 hover:border-neutral-400 dark:hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isActive ? "text-blue-600 dark:text-[#0099ff]" : "text-neutral-500"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-[#0099ff] shadow-[0_0_8px_#0099ff]" />
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold text-[#171717] dark:text-white">
                  {tab.title}
                </h3>
                <p className="mt-2 text-xs text-[#707070] dark:text-neutral-400 leading-relaxed font-normal">
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
