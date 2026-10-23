"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function PipelineSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "sync",
      title: "Auto-sync repositories",
      description:
        "Push commits or merge PRs to GitHub. Resummit listens via webhook, parses your diffs, and updates your accomplishments automatically.",
      metricTime: "4.8 sec",
      breakdown: [
        { label: "Scan Git repos", time: "1.2s" },
        { label: "Parse PRs & diffs", time: "2.1s" },
        { label: "Quantify impact (XYZ)", time: "1.1s" },
        { label: "Format ATS bullets", time: "0.4s" },
      ],
      tag: "github.com/developer/portfolio",
      footer: "From git push to interview-ready bullet",
    },
    {
      id: "xyz",
      title: "Google XYZ Impact Formula",
      description:
        "Every bullet is structured as 'Accomplished [X] as measured by [Y] by doing [Z]', transforming raw code into recruiter-proven metrics.",
      metricTime: "94/100",
      breakdown: [
        { label: "Action verbs extracted", time: "100%" },
        { label: "Metrics quantified", time: "92%" },
        { label: "Tech stack highlighted", time: "96%" },
        { label: "ATS keyword density", time: "94%" },
      ],
      tag: "resume.engine/xyz-parser",
      footer: "Scored against top tech hiring rubrics",
    },
    {
      id: "roles",
      title: "Role-specific tailoring",
      description:
        "Generate specialized versions for Backend, Frontend, Fullstack, or DevOps without maintaining separate Word documents.",
      metricTime: "5 presets",
      breakdown: [
        { label: "Senior Full-Stack", time: "Active" },
        { label: "Backend Systems", time: "Ready" },
        { label: "Frontend / React", time: "Ready" },
        { label: "Cloud & DevOps", time: "Ready" },
      ],
      tag: "resume.engine/role-matrix",
      footer: "One source of truth, tailored for every application",
    },
    {
      id: "ats",
      title: "ATS-optimized export",
      description:
        "Single-column, recruiter-scannable PDF and clean plain-text formats designed to glide through Greenhouse, Lever, and Workday.",
      metricTime: "99.8%",
      breakdown: [
        { label: "Parse rate on Greenhouse", time: "100%" },
        { label: "Parse rate on Lever", time: "100%" },
        { label: "Parse rate on Workday", time: "99.4%" },
        { label: "Single-page constraint", time: "Enforced" },
      ],
      tag: "export.resummit.app/pdf-engine",
      footer: "Zero formatting errors on all applicant trackers",
    },
  ];

  const currentTab = tabs[activeTab];

  return (
    <section id="pipeline" className="scroll-mt-12 bg-[#09090b] text-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <h2 className="text-4xl font-normal sm:font-medium tracking-tight text-white sm:text-5xl leading-[1.15]">
            Everything between your commits and your next offer
          </h2>
        </div>

        {/* Mountain Container with Floating Live Status Card */}
        <div className="mt-12 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[460px] sm:min-h-[500px] flex items-center justify-center p-6 sm:p-12">
          {/* Mountain Artwork Background */}
          <img
            src="/images/fairweather_sky.jpg"
            alt="Mountain landscape"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Floating White Card (Exact match to reference card) */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#fafafa]/95 backdrop-blur-md p-6 text-neutral-900 shadow-2xl border border-white/60 transition-all duration-300">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-neutral-500 font-medium">
                {currentTab.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Big Metric Display */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-neutral-950">
                {currentTab.metricTime}
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                execution
              </span>
            </div>

            {/* Checklist Items with Durations */}
            <div className="mt-5 space-y-2.5 border-t border-neutral-200/80 pt-4">
              {currentTab.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-neutral-700 font-medium">{item.label}</span>
                  </div>
                  <span className="font-mono text-xs text-neutral-500">{item.time}</span>
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="mt-5 border-t border-neutral-200/80 pt-3 text-center">
              <p className="text-[11px] text-neutral-500">{currentTab.footer}</p>
            </div>
          </div>
        </div>

        {/* 4 Horizontal Tabs below Mountain Card */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className="text-left group transition-all"
              >
                {/* Active indicator top bar */}
                <div
                  className={`h-[2px] w-full transition-all duration-300 ${
                    isActive ? "bg-white" : "bg-neutral-800 group-hover:bg-neutral-700"
                  }`}
                />
                <h3
                  className={`mt-4 text-base font-medium tracking-tight transition-colors ${
                    isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
                  }`}
                >
                  {tab.title}
                </h3>
                {isActive && (
                  <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed animate-fadeIn">
                    {tab.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons below Tabs */}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href={LANDING_CONFIG.brand.primaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-white/40 shadow-sm"
          >
            <span>Start auto-syncing</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#workflow"
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Explore the pipeline workflow →
          </a>
        </div>
      </div>
    </section>
  );
}
