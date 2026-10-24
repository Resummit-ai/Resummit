"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, GitBranch, PenTool, FileDown } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function FeaturePillarsSection() {
  const pillars = [
    {
      badge: "GITHUB INTEGRATION",
      title: "GitHub Read-Only Sync",
      desc: "Secure OAuth integration that reads public repositories, commits, and README files automatically. Strictly read-only.",
      icon: <GitBranch className="h-4 w-4 text-blue-600 dark:text-sky-400" />,
      subHeader: "weather-app · public repo · main",
      accent: "from-blue-600/15 via-sky-500/10 to-indigo-600/15",
    },
    {
      badge: "AI RESUME WRITING",
      title: "Accomplishment Synthesis",
      desc: "Generate recruiter-friendly resume bullets from the systems, projects, and workflows you actually built in your code.",
      icon: <PenTool className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      subHeader: "Raw Commits → ATS-Friendly Bullets",
      accent: "from-emerald-600/15 via-teal-500/10 to-blue-600/15",
    },
    {
      badge: "ATS EXPORT ENGINE",
      title: "Single-Column PDF Export",
      desc: "Export clean, professional resumes with consistent single-column formatting, standard margins, and verified ATS-friendly layouts.",
      icon: <FileDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      subHeader: "Single-Column PDF · Clean Standard Layout",
      accent: "from-indigo-600/15 via-purple-500/10 to-blue-600/15",
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-12 bg-[#F5F5F3] dark:bg-[#09090b] text-[#171717] dark:text-white py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-neutral-900 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-wider text-blue-600 dark:text-sky-400 uppercase">
            Features
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#171717] dark:text-white leading-[1.12]">
            Built for developers, not generic templates
          </h2>
          <p className="mt-4 text-base text-[#707070] dark:text-neutral-400">
            Professional resume generation powered directly by your repositories, projects, and engineering work.
          </p>
        </div>

        {/* 3 Pillar Cards with CSS Product Mock Headers */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-[#E5E5E5] dark:border-neutral-800/80 bg-white dark:bg-[#111114] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-xl hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
            >
              {/* CSS Product Header Mock (No stock photos) */}
              <div className={`relative h-44 overflow-hidden border-b border-[#E5E5E5] dark:border-neutral-800 bg-gradient-to-br ${pillar.accent} flex items-center justify-center p-6`}>
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#0099ff 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Floating pill mock */}
                <div className="relative z-10 w-full rounded-xl bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md px-3.5 py-2.5 border border-[#E5E5E5] dark:border-neutral-800 text-[11px] font-mono text-[#171717] dark:text-neutral-300 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{pillar.subHeader}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-sky-400 tracking-wider uppercase">
                  {pillar.icon}
                  <span>{pillar.badge}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#171717] dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#707070] dark:text-neutral-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  href={LANDING_CONFIG.brand.primaryCta.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171717] dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-white transition-colors"
                >
                  <span>Build my CV free</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
