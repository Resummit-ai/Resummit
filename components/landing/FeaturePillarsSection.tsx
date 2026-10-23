"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, GitBranch, PenTool, FileDown } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function FeaturePillarsSection() {
  const pillars = [
    {
      badge: "GITHUB INTEGRATION",
      title: "GitHub Sync",
      desc: "Secure OAuth integration that reads repositories, commits, README files, and tech stacks automatically. Strictly read-only.",
      icon: <GitBranch className="h-4 w-4 text-sky-400" />,
      subHeader: "weather-app · 142 commits · main",
    },
    {
      badge: "AI RESUME WRITING",
      title: "AI Resume Writing",
      desc: "Generate recruiter-friendly resume bullets from the systems, projects, and workflows you actually built using the Google XYZ formula.",
      icon: <PenTool className="h-4 w-4 text-emerald-400" />,
      subHeader: "Raw Commits → Executive Bullets (98% ATS)",
    },
    {
      badge: "ATS EXPORT ENGINE",
      title: "PDF Export",
      desc: "Export clean, professional resumes with consistent single-column formatting, perfect margins, and verified ATS-friendly layouts.",
      icon: <FileDown className="h-4 w-4 text-blue-400" />,
      subHeader: "Single-Page PDF · ATS Standard Compliant",
    },
  ];

  return (
    <section id="features" className="scroll-mt-12 bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
            Core Features
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-medium tracking-tight text-white leading-[1.12]">
            Built for developers, not generic templates.
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Professional resume generation powered directly by your repositories, projects, and engineering work.
          </p>
        </div>

        {/* 3 Pillar Cards with Sky Headers (Matching localhost 3000) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-neutral-800/80 bg-[#111114] overflow-hidden shadow-xl hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Sky Header Image Card */}
              <div className="relative h-44 overflow-hidden border-b border-neutral-800">
                <img
                  src="/images/fairweather_sky.jpg"
                  alt="Fairweather sky artwork"
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-black/20 pointer-events-none" />

                {/* Floating pill in sky */}
                <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between rounded-lg bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="truncate">{pillar.subHeader}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-400 tracking-wider uppercase">
                  {pillar.icon}
                  <span>{pillar.badge}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  href={LANDING_CONFIG.brand.primaryCta.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors"
                >
                  <span>Get started</span>
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
